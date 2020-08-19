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
    const res = await put(`/cases/${caseId}`, JSON.stringify(body), {
      Authorization: parseInt(user.personalNumber),
    }).then(res => {
      const { caseId, ...other } = res.data.data;
      const updatedCase = { caseId, ...other, updatedAt: Date.now() };

      return {
        type: actionTypes.updateCase,
        payload: { [caseId]: updatedCase },
        effects: callback(updatedCase),
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
  const newCase = await post('/cases', JSON.stringify(body), {
    Authorization: parseInt(user.personalNumber),
  }).then(
    response =>
      //   setCurrentCase(response.data.data);
      //   setFetching(false);
      response.data.data
  );
  // .then(newCase => callback(newCase));
  //   callback(newCase);
  const { caseId } = newCase;
  return {
    type: actionTypes.createCase,
    payload: { [caseId]: newCase },
    effects: callback(newCase),
  };
}

export function deleteCase(caseId) {
  return {
    type: actionTypes.deleteCase,
    payload: { [caseId]: undefined },
  };
}

export async function fetchCases(user, callback) {
  const cases = await get('/cases', undefined, user.personalNumber).then(response => {
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
