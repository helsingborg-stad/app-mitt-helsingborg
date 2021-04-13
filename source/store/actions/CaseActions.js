import { get, post, put } from '../../helpers/ApiRequest';
import { convertAnswersToArray } from '../../helpers/CaseDataConverter';
import { encryptWithAesKey, decryptWithAesKey } from '../../services/encryption';

export const actionTypes = {
  updateCase: 'UPDATE_CASE',
  createCase: 'CREATE_CASE',
  deleteCase: 'DELETE_CASE',
  fetchCases: 'FETCH_CASE',
  apiError: 'API_ERROR',
};

export async function updateCase(
  { user, caseId, formId, answerObject, status, currentPosition, formQuestions },
  callback
) {
  let answers = convertAnswersToArray(answerObject, formQuestions);

  if (status?.type === 'active:ongoing') {
    const encryptedAnswers = await encryptWithAesKey(user, JSON.stringify(answers));
    answers = { encryptedAnswers };
  }

  const body = {
    statusType: status.type,
    answers,
    currentPosition,
    currentFormId: formId,
  };

  try {
    const res = await put(`/cases/${caseId}`, JSON.stringify(body));
    const { id, attributes } = res.data.data;
    const flatUpdatedCase = { id, updatedAt: Date.now(), ...attributes };
    if (callback) {
      callback(flatUpdatedCase);
    }
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

export async function createCase(form, callback) {
  const body = {
    provider: form.provider,
    statusType: 'notStarted',
    currentFormId: form.id,
    forms: {
      [form.id]: {
        answers: [],
        currentPosition: { index: 0, level: 0, currentMainStep: 1, currentMainStepIndex: 0 },
      },
    },
    details: {},
  };

  try {
    const response = await post('/cases', JSON.stringify(body));
    const newCase = response.data.data;
    const flattenedNewCase = {
      id: newCase.id,
      ...newCase.attributes,
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

export async function fetchCases(user) {
  try {
    const response = await get('/cases');
    if (response?.data?.data?.attributes?.cases) {
      const cases = {};

      // eslint-disable-next-line no-restricted-syntax
      for await (const c of response.data.data.attributes.cases) {
        if (c?.status.type === 'active:ongoing') {
          const { encryptedAnswers } = c.forms[c.currentFormId].answers;

          if (encryptedAnswers) {
            const decryptedAnswers = await decryptWithAesKey(user, encryptedAnswers);
            c.forms[c.currentFormId].answers = JSON.parse(decryptedAnswers);
          }
        }
        cases[c.id] = c;
      }

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
