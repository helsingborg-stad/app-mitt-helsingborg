import generateInitialCase from 'app/containers/dynamicFormData';
import { get, post, put } from 'app/helpers/ApiRequest';

export const actionTypes = {
  updateCase: 'UPDATE_CASE',
  createCase: 'CREATE_CASE',
  deleteCase: 'DELETE_CASE',
  fetchCases: 'FETCH_CASE',
  apiError: 'API_ERROR',
};

export async function updateCase(caseId, data, status, currentStep, user, callback) {
  const body = {
    status,
    data,
    currentStep,
  };

  try {
    const res = await put(`/cases/${caseId}`, JSON.stringify(body));
    const { id, attributes } = res.data.data;
    const flatUpdatedCase = { id, updatedAt: Date.now(), ...attributes };
    if (callback) callback(flatUpdatedCase);
    return {
      type: actionTypes.updateCase,
      payload: { cases: { [id]: flatUpdatedCase } },
    };
  } catch (error) {
    console.log(`Update current case error: ${error}`);
  }
}

export async function createCase(formId, user, cases, callback) {
  const initialData = generateInitialCase(formId, user, cases);

  const body = {
    personalNumber: parseInt(user.personalNumber),
    status: 'ongoing',
    type: 'VIVA_CASE',
    data: initialData || {},
    currentStep: 1,
    formId,
  };
  const response = await post('/cases', JSON.stringify(body));
  const newCase = response.data.data;
  const { id } = newCase;
  const flattenedNewCase = { id: newCase.id, ...newCase.attributes };
  callback(flattenedNewCase);
  return {
    type: actionTypes.createCase,
    payload: { cases: { [id]: flattenedNewCase } },
  };
}

export function deleteCase(caseId) {
  return {
    type: actionTypes.deleteCase,
    payload: { cases: { [caseId]: undefined } },
  };
}

export async function fetchCases(user, callback) {
  try {
    const response = await get('/cases');
    if (response?.data?.data?.map) {
      const cases = {};
      response.data.data.forEach(c => (cases[c.id] = { id: c.id, ...c.attributes }));

      callback(cases);
      return {
        type: actionTypes.fetchCases,
        payload: { cases },
      };
    }
  } catch (error) {
    console.error(error);
    return {
      type: actionTypes.apiError,
    };
  }
  return {
    type: actionTypes.fetchCases,
    payload: {},
  };
}
