import { get, post, put } from 'app/helpers/ApiRequest';
import { convertAnswersToArray, getFormQuestions } from 'app/helpers/CaseDataConverter';
import generateInitialCaseAnswers from './dynamicFormData';

export const actionTypes = {
  updateCase: 'UPDATE_CASE',
  createCase: 'CREATE_CASE',
  deleteCase: 'DELETE_CASE',
  fetchCases: 'FETCH_CASE',
  apiError: 'API_ERROR',
};

export async function updateCase(caseId, data, status, currentPosition, formQuestions, callback) {
  const answers = convertAnswersToArray(data, formQuestions);

  const body = {
    status,
    answers,
    currentPosition,
  };

  try {
    const res = await put(`/cases/${caseId}`, JSON.stringify(body));
    const { id, attributes } = res.data.data;
    const flatUpdatedCase = { id, updatedAt: Date.now(), ...attributes };
    if (callback) callback(flatUpdatedCase);
    return {
      type: actionTypes.updateCase,
      payload: flatUpdatedCase,
    };
  } catch (error) {
    console.log(`Update current case error: ${error}`);
    return {
      type: actionTypes.apiError,
      payload: error,
    };
  }
}

export async function createCase(form, user, cases, callback) {
  const initialAnswersObject = generateInitialCaseAnswers(form, user, cases);
  const formQuestions = getFormQuestions(form);
  // Convert to new data strucure to be saved in Cases API
  const initialAnswersArray = convertAnswersToArray(initialAnswersObject, formQuestions);

  const body = {
    formId: form.id,
    provider: 'VIVA',
    status: 'ongoing',
    currentPosition: {
      index: 0,
      level: 0,
      currentMainStep: 1,
      currentMainStepIndex: 0,
    },
    details: {
      period: {
        startDate: 1601994748326,
        endDate: 1701994748326,
      },
    },
    answers: initialAnswersArray || [],
  };

  try {
    const response = await post('/cases', JSON.stringify(body));
    const newCase = response.data.data;
    const flattenedNewCase = {
      id: newCase.id,
      ...newCase.attributes,
      data: initialAnswersObject,
    };
    callback(flattenedNewCase);
    return {
      type: actionTypes.createCase,
      payload: flattenedNewCase,
    };
  } catch (error) {
    console.log('create case api error', error);
    return {
      type: actionTypes.apiError,
      payload: error,
    };
  }
}

export function deleteCase(caseId) {
  return {
    type: actionTypes.deleteCase,
    payload: caseId,
  };
}

export async function fetchCases(callback) {
  try {
    const response = await get('/cases');
    if (response?.data?.data?.attributes?.cases) {
      const cases = {};
      response.data.data.attributes.cases.forEach(c => (cases[c.id] = c));

      callback(cases);
      return {
        type: actionTypes.fetchCases,
        payload: cases,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      type: actionTypes.apiError,
      payload: error,
    };
  }
  return {
    type: actionTypes.fetchCases,
    payload: {},
  };
}
