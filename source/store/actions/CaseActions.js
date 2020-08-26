import generateInitialCase from 'app/containers/dynamicFormData';
import { get, post, put } from 'app/helpers/ApiRequest';

export const actionTypes = {
  updateCase: 'UPDATE_CASE',
  createCase: 'CREATE_CASE',
  deleteCase: 'DELETE_CASE',
  fetchCases: 'FETCH_CASE',
};

export async function updateCase(caseId, data, status, currentStep, user, callback) {
  const body = {
    status,
    data,
    currentStep,
  };

  try {
    const res = await put(`/cases/${caseId}`, JSON.stringify(body)).then(res => {
      console.log('update case resp:', res.data.data);
      const { id, attributes } = res.data.data;
      const flatUpdatedCase = { id, updatedAt: Date.now(), ...attributes };
      // const updatedCase = { caseId, ...other, updatedAt: Date.now() };
      if (callback) callback(flatUpdatedCase);
      return {
        type: actionTypes.updateCase,
        payload: { [id]: flatUpdatedCase },
      };
    });
    return res;
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
  // TODO: Remove Auhtorization header when token authentication works as expected.
  const newCase = await post('/cases', JSON.stringify(body)).then(response => response.data.data);
  console.log('new case', newCase);
  const { id } = newCase;
  const flattenedNewCase = { id: newCase.id, ...newCase.attributes };
  callback(flattenedNewCase);
  return {
    type: actionTypes.createCase,
    payload: { [id]: flattenedNewCase },
  };
}

export function deleteCase(caseId) {
  return {
    type: actionTypes.deleteCase,
    payload: { [caseId]: undefined },
  };
}

export async function fetchCases(user, callback) {
  const cases = await get('/cases').then(response => {
    if (response?.data?.data?.map) {
      const newCases = {};
      response.data.data.forEach(c => (newCases[c.id] = { id: c.id, ...c.attributes }));
      return newCases;
    }
    return {};
  });
  callback(cases);
  return {
    type: actionTypes.fetchCases,
    payload: cases,
  };
}
