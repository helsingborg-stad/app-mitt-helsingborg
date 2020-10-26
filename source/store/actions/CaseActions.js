import generateInitialCase from 'app/store/actions/dynamicFormData';
import { get, post, put } from 'app/helpers/ApiRequest';

export const actionTypes = {
  updateCase: 'UPDATE_CASE',
  createCase: 'CREATE_CASE',
  deleteCase: 'DELETE_CASE',
  fetchCases: 'FETCH_CASE',
  apiError: 'API_ERROR',
};

export async function updateCase(caseId, data, status, currentStep, user, callback) {
  const answers = Object.entries(data).map(field => {
    console.log('field', field);

    const fieldObject = {
      fieldId: field[0],
      value: field[1],
      referenceValue: null,
      tags: [],
    };

    return fieldObject;
  });

  console.log('answers', answers);

  const body = {
    status,
    answers,
    currentStep,
  };

  console.log('PUT request body', body);

  try {
    const res = await put(`/cases/${caseId}`, JSON.stringify(body));
    console.log('PUT request response', res);

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

export async function createCase(formId, user, cases, callback) {
  let initialData = generateInitialCase(formId, user, cases);
  initialData = [];
  console.log('initialData', initialData);

  const body = {
    formId,
    userId: parseInt(user.personalNumber),
    provider: 'VIVA', // TODO: Fix hardcoded value
    status: 'ongoing',
    currentStep: 0,
    details: {
      personalNumber: parseInt(user.personalNumber),
      period: {
        startDate: 1601994748326, // TODO: Fix hardcoded value
        endDate: 1701994748326, // TODO: Fix hardcoded value
      },
    },
    answers: initialData || [],
  };

  try {
    const response = await post('/cases', JSON.stringify(body));
    console.log('create case response', response);
    const newCase = response.data.data;
    const flattenedNewCase = { id: newCase.id, ...newCase.attributes };
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
    if (response?.data?.data?.map) {
      const cases = {};
      response.data.data.forEach(c => (cases[c.id] = { id: c.id, ...c.attributes }));

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
