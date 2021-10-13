import { get, post, put } from "../../helpers/ApiRequest";
import { convertAnswersToArray } from "../../helpers/CaseDataConverter";
import deepCopyViaJson from "../../helpers/Objects";
import {
  decryptFormAnswers,
  encryptFormAnswers,
} from "../../services/encryption";
import { UserInterface } from "../../services/encryption/EncryptionHelper";
import { ApplicationStatusType, Case } from "../../types/Case";

export const actionTypes = {
  updateCase: "UPDATE_CASE",
  createCase: "CREATE_CASE",
  deleteCase: "DELETE_CASE",
  fetchCases: "FETCH_CASE",
  apiError: "API_ERROR",
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
    encryptAnswers = true,
    encryption,
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
    updateCaseRequestBody = await encryptFormAnswers(
      user,
      updateCaseRequestBody
    );
  }

  if (signature?.success) {
    updateCaseRequestBody.signature = signature;
  }

  try {
    const res = await put(
      `/cases/${caseId}`,
      JSON.stringify(updateCaseRequestBody)
    );
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
    statusType: "notStarted",
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
        encryption: { type: "decrypted" },
      },
    },
    details: {},
  };

  try {
    const response = await post("/cases", JSON.stringify(body));
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
    console.log("create case api error", error);
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

export async function fetchCases(user: UserInterface): Promise<any> {
  try {
    const response = await get("/cases");
    const rawCases: Case[] = response?.data?.data?.attributes?.cases;
    if (rawCases) {
      const cases = await rawCases.reduce(
        async (pendingProcessedCases, rawCase) => {
          const processedCases = await pendingProcessedCases;
          const {
            currentFormId,
            status: { type: statusType },
          } = rawCase;

          if (
            statusType === ApplicationStatusType.ACTIVE_ONGOING ||
            statusType === ApplicationStatusType.ACTIVE_SIGNATURE_PENDING
          ) {
            try {
              const currentForm = rawCase.forms[currentFormId];
              const decryptedForm = await decryptFormAnswers(user, currentForm);
              const decryptedCase = {
                ...deepCopyViaJson(rawCase),
                [currentFormId]: decryptedForm,
              };

              return {
                ...processedCases,
                [rawCase.id]: decryptedCase,
              };
            } catch (e) {
              console.log(
                `Failed to decrypt answers (Case ID: ${rawCase?.id}), Error: `,
                e
              );
            }
          }

          return {
            ...processedCases,
            [rawCase.id]: rawCase,
          };
        },
        Promise.resolve({})
      );

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
