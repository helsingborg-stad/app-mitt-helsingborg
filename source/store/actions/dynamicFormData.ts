import { Form } from '../../types/FormTypes';
import { Case } from '../../types/CaseType';
import { User } from '../../types/UserTypes';

const addIds = (descriptor: string[], questionId:string, formId: string) =>
  descriptor.map(s => {
    if (s.split('.')[0] !== 'user' && questionId !=='') {
      return `${formId}.${questionId}.${s}`;
    } else if (s.split('.')[0] !== 'user' && questionId ==='') {
      return `${formId}.${s}`;
    }
    return s;
  });

/** Takes a form and generates the dataMap template used to fill the dynamical data.  */
const makeDataMap = (form: Form) => {
  const dataMap = {};
  form.steps.forEach(step => {
    step.questions.forEach(qs => {
      if (qs.loadPrevious) {
        dataMap[qs.id] = addIds(qs.loadPrevious, '', form.id);
      } else if (qs.type === 'substepList' && qs.items) {
        const items = {};
        qs.items.forEach(item => {
          if (item.loadPrevious) {
            items[item.title] = addIds(item.loadPrevious, qs.id, form.id);
          }
        });
        if (Object.keys(items).length > 0) {
          dataMap[qs.id] = items;
        }
      } else if (qs.type === 'editableList' && qs.inputs) {
        const inputs = {};
        qs.inputs.forEach(input => {
          if (input.loadPrevious) {
            inputs[input.key] = addIds(input.loadPrevious, qs.id, form.id);
          }
        });
        if (Object.keys(inputs).length > 0) {
          dataMap[qs.id] = inputs;
        }
      }
    });
  });
  return dataMap;
};

const sortCasesByLastUpdated = (list: Case[]) => list.sort((a, b) => b.updatedAt - a.updatedAt);

const treeParseAcc = (obj: Record<string, any> | string[], acc: Record<string, any>, parser: (s: string[]) => any) => {
  if ( Array.isArray(obj) && obj.every( s => typeof s === 'string')) {
    const parseRes = parser(obj);
    return parseRes === '' ? undefined : parseRes;
  }
  const res: Record<string, any> = {};
  Object.keys(obj).forEach(key => {
    res[key] = treeParseAcc(obj[key], acc, parser);
  });
  return res;
};
const treeParse = (obj: Record<string, any>, parser: (s: string[]) => any): Record<string, any> => treeParseAcc(obj, {}, parser);

const getUserInfo = (user: User, strArray: string[] ): string|undefined => strArray.reduce((prev, current) => { 
  if(prev && prev[current]) return prev[current];
  return undefined;
}, user);
const getCaseInfo = (c: Case, strArray: string[]) => strArray.reduce((prev, current) => { 
  if (prev && prev[current]) return prev[current];
  return undefined;
}, c.data);

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
      return getCaseInfo(latestRelevantCase, strArray.slice(1));
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
