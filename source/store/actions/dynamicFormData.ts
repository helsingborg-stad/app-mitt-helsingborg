import { Form } from '../../types/FormTypes';
import { CaseWithAnswerArray } from '../../types/CaseType';
import { User } from '../../types/UserTypes';
import { convertAnswerArrayToObject } from '../../helpers/DataStructure';

/**
 * Takes an array of strings, and pre-pends each one with the sent in formId and/or questionId, with
 * dots in between. If the string starts with 'user', then we don't prepend anything.
 * @param {array} descriptor
 * @param {string} questionId
 * @param {string} formId
 */
const addQuestionAndFormIds = (descriptor: string[], questionId: string, formId: string) =>
  descriptor.map(s => {
    if (s.split('.')[0] !== 'user' && questionId !== '') {
      return `${formId}.${questionId}.${s}`;
    }
    if (s.split('.')[0] !== 'user' && questionId === '') {
      return `${formId}.${s}`;
    }
    return s;
  });

/**
 * Takes a form and generates the dataMap template used to fill the dynamical data.
 * @param {Object} form
 */
const generateDataMapTemplateFromForm = (form: Form) => {
  const dataMap = {};
  form.steps.forEach(step => {
    if (!step.questions) {
      return;
    }
    step.questions.forEach(question => {
      if (question.loadPrevious) {
        dataMap[question.id] = addQuestionAndFormIds(question.loadPrevious, '', form.id);
      } else if (question.type === 'substepList' && question.items) {
        const items = {};
        question.items.forEach(item => {
          if (item.loadPrevious) {
            items[item.title] = addQuestionAndFormIds(item.loadPrevious, question.id, form.id);
          }
        });
        if (Object.keys(items).length > 0) {
          dataMap[question.id] = items;
        }
      } else if (question.type === 'editableList' && question.inputs) {
        const inputs = {};
        question.inputs.forEach(input => {
          if (input.loadPrevious) {
            inputs[input.key] = addQuestionAndFormIds(input.loadPrevious, question.id, form.id);
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

/**
 * Sorts cases list by last updated
 * @param {array} list
 */
const sortCasesByLastUpdated = (list: CaseWithAnswerArray[]) =>
  list.sort((a, b) => b.updatedAt - a.updatedAt);

/**
 *  Goes through a tree structure (the obj parameter) and tries to replace each leaf node using the parser.
 * @param {Object} obj The tree structure to parse. All leaf nodes should be strings
 * @param {function} parser A function for replacing the leaf nodes with new strings (i.e. map template strings to values)
**/
const treeParse = (
  obj: Record<string, any> | string[],
  parser: (s: string[]) => any
): Record<string, any> => {
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

/**
 * Takes a user-object and a list of strings specifying a property on the user, like [address, street],
 * and tries to return the corresponding value on the user object.
 * @param {Object} user The user object, for personal information
 * @param {array} strArray list of strings that specifies a user property, like [address, street]
 * */
const getUserInfo = (user: User, strArray: string[]): string | undefined =>
  strArray.reduce((prev, current) => {
    if (prev && prev[current]) return prev[current];
    return undefined;
  }, user);

/**
 * Takes a case answers object and an array of strings that specifies an answer, and tries to return the corresponding value from the case object.
 * @param {Object} answers The case answer object (i.e. not an array)
 * @param {array} strArray String array specifying an answer
 */
const getCaseInfo = (answers: Record<string, any>, strArray: string[]) =>
  strArray.reduce((prev, current) => {
    if (prev && prev[current]) return prev[current];
    return undefined;
  }, answers);

/**
 * Generates a parser that will take strings like user.firstName or formId.salary.amount, and try to convert them to values from the sent in user and cases object.
 * @param {Object} user The user object, for personal information
 * @param {array} cases List of previous cases
 */
const generateParser = (user: User, cases: CaseWithAnswerArray[]) => (idArray: string[]) => {
  const parseArray = idArray.map(str => {
    const strArray = str.split('.');
    if (strArray[0] === 'user') {
      return getUserInfo(user, strArray.slice(1));
    }

    const formId = strArray[0];
    const sortedCases = sortCasesByLastUpdated(cases);
    const latestRelevantCase = sortedCases.find(c => c.formId === formId);
    if (latestRelevantCase) {
      const answersObject = convertAnswerArrayToObject(latestRelevantCase.answers);
      return getCaseInfo(answersObject, strArray.slice(1));
    }
    return undefined;
  });
  const result = parseArray.find(res => res);
  return result || '';
};

/**
 * Assembles data from the user object and previous cases to fill out an initial case, as specified by the form template.
 * @param {Object} form The form to generate initial data for
 * @param {Object} user The user object
 * @param {array} cases List of previous cases
 */
const generateInitialCaseAnswers = (form: Form, user: User, cases: CaseWithAnswerArray[]) => {
  const dataMap = generateDataMapTemplateFromForm(form);
  const parser = generateParser(user, cases);
  const initialCaseAnswers = treeParse(dataMap, parser);
  return initialCaseAnswers;
};

export default generateInitialCaseAnswers;
