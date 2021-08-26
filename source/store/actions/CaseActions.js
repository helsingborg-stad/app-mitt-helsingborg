import { get, post, put } from '../../helpers/ApiRequest';
import { convertAnswersToArray } from '../../helpers/CaseDataConverter';
import { decryptFormAnswers, encryptFormAnswers } from '../../services/encryption';
import { mergeFormAnswersAndEncryption } from '../../services/encryption/EncryptionHelper';

export const actionTypes = {
  updateCase: 'UPDATE_CASE',
  createCase: 'CREATE_CASE',
  deleteCase: 'DELETE_CASE',
  fetchCases: 'FETCH_CASE',
  apiError: 'API_ERROR',
};

export async function updateCase(
  {
    user,
    caseId,
    formId,
    answerObject,
    signature,
    currentPosition,
    formQuestions,
    encryption,
    encryptAnswers = true,
  },
  callback
) {
  let updateCaseRequestBody = {
    answers: convertAnswersToArray(answerObject, formQuestions),
    currentPosition,
    currentFormId: formId,
    encryption,
  };

  if (encryptAnswers) {
    const encryptedProperties = await encryptFormAnswers(user.personalNumber, updateCaseRequestBody);
    updateCaseRequestBody = mergeFormAnswersAndEncryption(updateCaseRequestBody, encryptedProperties);
  }

  if (signature?.success) {
    updateCaseRequestBody.signature = signature;
  }

  try {
    const res = await put(`/cases/${caseId}`, JSON.stringify(updateCaseRequestBody));
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
        encryption: { type: 'decrypted' },
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
        if (c?.status.type === 'active:ongoing' || c?.status.type === 'active:signature:pending') {
          try {
            const updatedProperties = await decryptFormAnswers(user.personalNumber, c.forms[c.currentFormId]);
            c.forms[c.currentFormId] = mergeFormAnswersAndEncryption(c.forms[c.currentFormId], updatedProperties);
            cases[c.id] = c;
          } catch (e) {
            console.log(`Failed to decrypt answers (Case ID: ${c?.id}), Error: `, e);
          }
        } else {
          cases[c.id] = c;
        }
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
