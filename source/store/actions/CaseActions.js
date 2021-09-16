import { get, post, put } from '../../helpers/ApiRequest';
import { convertAnswersToArray } from '../../helpers/CaseDataConverter';
import {
  decryptFormAnswers,
  encryptFormAnswers,
  EncryptionException,
} from '../../services/encryption';
import {
  mergeFormAnswersAndEncryption,
  updateFormEncryption,
} from '../../services/encryption/EncryptionHelper';

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

  const [encryptionStatus, updatedForm] = await updateFormEncryption(
    user.personalNumber,
    updateCaseRequestBody
  );

  updateCaseRequestBody = updatedForm;

  if (encryptAnswers) {
    let encryptedAnswers;
    try {
      encryptedAnswers = await encryptFormAnswers(user.personalNumber, updateCaseRequestBody);
    } catch (error) {
      if (error?.status === 'missingSymmetricKey') {
        // Symmetric key (co-applicant) is desired but no key has been generated yet,
        // for now, encrypt with private AES key.
        console.log('Missing symmetric key - using private AES key for now');
        encryptedAnswers = await encryptFormAnswers(
          user.personalNumber,
          updateCaseRequestBody,
          true
        );
      } else {
        throw error;
      }
    }

    updateCaseRequestBody = mergeFormAnswersAndEncryption(updateCaseRequestBody, encryptedAnswers);
  }

  if (signature?.success) {
    updateCaseRequestBody.signature = signature;
  }

  try {
    const res = await put(`/cases/${caseId}`, JSON.stringify(updateCaseRequestBody));
    const { id, attributes } = res.data.data;
    const flatUpdatedCase = {
      id,
      updatedAt: Date.now(),
      ...attributes,
      forms: {
        ...attributes.forms,
        [formId]: {
          ...attributes.forms[formId],
          encryptionStatus,
        },
      },
    };

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
        currentPosition: {
          index: 0,
          level: 0,
          currentMainStep: 1,
          currentMainStepIndex: 0,
        },
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
      const fetchedCases = response.data.data.attributes.cases;
      const processedCases = await fetchedCases.reduce(async (cases, userCase) => {
        try {
          const form = userCase.forms[userCase.currentFormId];

          // Updating encryption is based on the existing encryption method, so we're doing it here
          // as the form is decrypted for the rest of its lifetime in the app until updateCase.
          const [updateStatus, updatedForm] = await updateFormEncryption(user.personalNumber, form);

          const myPublicKey = form.encryption.publicKeys?.[user.personalNumber];

          if (
            updatedForm.encryption.type !== form.encryption.type ||
            updatedForm.encryption.publicKeys?.[user.personalNumber] !== myPublicKey
          ) {
            console.log(`encryption for case ${userCase.id} changed - sending update`);
            await put(
              `/cases/${userCase.id}`,
              JSON.stringify({
                currentFormId: userCase.currentFormId,
                answers: updatedForm.answers,
                currentPosition: updatedForm.currentPosition,
                encryption: updatedForm.encryption,
              })
            );
          }

          if (
            updateStatus === 'ready' ||
            updateStatus === 'missingCoApplicantPublicKey' ||
            updateStatus === 'missingSymmetricKey'
          ) {
            const decryptedForm = await decryptFormAnswers(user.personalNumber, updatedForm);
            const mergedForm = mergeFormAnswersAndEncryption(updatedForm, decryptedForm);

            return {
              ...cases,
              [userCase.id]: {
                ...userCase,
                forms: {
                  ...userCase.forms,
                  [userCase.currentFormId]: {
                    ...mergedForm,
                    encryptionStatus: updateStatus,
                  },
                },
              },
            };
          }

          if (updateStatus === 'missingAesKey') {
            const personsList = userCase.persons;
            if (Array.isArray(personsList)) {
              const me = personsList.find(
                (person) => person.personalNumber === user.personalNumber
              );
              if (me && me.role === 'coApplicant') {
                // We're the co-applicant and the main applicant has not re-encrypted yet
                // Just add the case in encrypted form
                return {
                  ...cases,
                  [userCase.id]: {
                    ...userCase,
                    forms: {
                      ...userCase.forms,
                      [userCase.currentFormId]: {
                        ...userCase.forms[userCase.currentFormId],
                        encryptionStatus: updateStatus,
                      },
                    },
                  },
                };
              }
            }
          }

          throw new EncryptionException(updateStatus, updateStatus);
        } catch (error) {
          console.error(`Failed to process form (Case ID: ${userCase?.id}), Error: `, error);
        }

        return cases;
      }, {});

      return {
        type: actionTypes.fetchCases,
        payload: processedCases,
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
