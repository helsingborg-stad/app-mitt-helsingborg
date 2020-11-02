import { Form } from '../../types/FormTypes';
import { Case } from '../../types/CaseType';
import { User } from '../../types/UserTypes';
import { convertAnswerArrayToObject } from '../../helpers/DataStructure';

const addIds = (descriptor: string[], questionId: string, formId: string) =>
  descriptor.map(s => {
    if (s.split('.')[0] !== 'user' && questionId !== '') {
      return `${formId}.${questionId}.${s}`;
    } else if (s.split('.')[0] !== 'user' && questionId === '') {
      return `${formId}.${s}`;
    }
    return s;
  });

/** Takes a form and generates the dataMap template used to fill the dynamical data.  */
const makeDataMap = (form: Form) => {
  const dataMap = {};
  form.steps.forEach(step => {
    if (!step.questions) {
      return;
    }
    step.questions.forEach(question => {
      if (question.loadPrevious) {
        dataMap[question.id] = addIds(question.loadPrevious, '', form.id);
      } else if (question.type === 'substepList' && question.items) {
        const items = {};
        question.items.forEach(item => {
          if (item.loadPrevious) {
            items[item.title] = addIds(item.loadPrevious, question.id, form.id);
          }
        });
        if (Object.keys(items).length > 0) {
          dataMap[question.id] = items;
        }
      } else if (question.type === 'editableList' && question.inputs) {
        const inputs = {};
        question.inputs.forEach(input => {
          if (input.loadPrevious) {
            inputs[input.key] = addIds(input.loadPrevious, question.id, form.id);
          }
        });
        if (Object.keys(inputs).length > 0) {
          dataMap[question.id] = inputs;
        }
      }
    });
  });
  return dataMap;
};

const sortCasesByLastUpdated = (list: Case[]) => list.sort((a, b) => b.updatedAt - a.updatedAt);

const treeParse = (obj: Record<string, any> | string[], parser: (s: string[]) => any) => {
  if (Array.isArray(obj) && obj.every(s => typeof s === 'string')) {
    const parseRes = parser(obj);
    return parseRes === '' ? undefined : parseRes;
  }

  const res: Record<string, any> = {};
  Object.keys(obj).forEach(key => {
    res[key] = treeParse(obj[key], parser);
  });
  return res;
};

const getUserInfo = (user: User, strArray: string[]): string | undefined => strArray.reduce((prev, current) => {
  if (prev && prev[current]) return prev[current];
  return undefined;
}, user);

const getCaseInfo = (c: Case, strArray: string[]) => strArray.reduce((prev, current) => {
  if (prev && prev[current]) return prev[current];
  return undefined;
}, c.answers);

const generateParser = (user: User, cases: Case[]) => (idArray: string[]) => {
  const parseArray = idArray.map(str => {
    const strArray = str.split('.');
    if (strArray[0] === 'user') {
      return getUserInfo(user, strArray.slice(1));
    }

    const formId = strArray[0];
    const sortedCases = sortCasesByLastUpdated(cases);
    const latestRelevantCase = sortedCases.find(c => c.formId === formId);
    if (latestRelevantCase) {
      const answersObject = convertAnswerArrayToObject(latestRelevantCase);
      return getCaseInfo(answersObject, strArray.slice(1));
    }
    return undefined;
  });
  const result = parseArray.find(res => res);
  return result || '';
};

const generateInitialCase = (form: Form, user: User, cases: Case[]) => {
  const dataMap = makeDataMap(form);
  const parser = generateParser(user, cases);
  const initialCase = treeParse(dataMap, parser);
  return initialCase;
};

export default generateInitialCase;
