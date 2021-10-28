import { wait } from "../../helpers/Misc";
import { Form } from "../../types/FormTypes";
import {
  Action,
  ActionTypes,
  CaseUpdate,
  UpdateCaseBody,
} from "../../types/CaseContext";
import {
  deserializeForm,
  serializeForm,
} from "../../services/encryption/EncryptionService";
import { get, post, put } from "../../helpers/ApiRequest";
import { convertAnswersToArray } from "../../helpers/CaseDataConverter";
import { deepCompareEquals, deepCopyViaJson } from "../../helpers/Objects";
import {
  decryptFormAnswers,
  encryptFormAnswers,
  setupSymmetricKey,
} from "../../services/encryption";
import {
  getStoredSymmetricKey,
  UserInterface,
} from "../../services/encryption/EncryptionHelper";
import { Case } from "../../types/Case";

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
  }: CaseUpdate,
  callback: (updatedCase: Case) => void
): Promise<Action> {
  let updateCaseRequestBody: UpdateCaseBody = {
    answers: convertAnswersToArray(answerObject, formQuestions),
    currentPosition,
    currentFormId: formId,
    encryption,
  };

  if (encryptAnswers) {
    const encryptedForm = await encryptFormAnswers(user, updateCaseRequestBody);
    updateCaseRequestBody = {
      ...updateCaseRequestBody,
      ...encryptedForm,
    };
  }

  if (signature?.success) {
    updateCaseRequestBody.signature = signature;
  }

  const serializedBody = serializeForm(updateCaseRequestBody);

  try {
    const res = await put(`/cases/${caseId}`, JSON.stringify(serializedBody));
    const { id, attributes } = res.data.data;
    const flatUpdatedCase = { id, updatedAt: Date.now(), ...attributes };
    if (callback) {
      callback(flatUpdatedCase);
    }
    return {
      type: ActionTypes.UPDATE_CASE,
      payload: flatUpdatedCase,
    };
  } catch (error) {
    console.log(`Update current case error: ${error}`);
    return {
      type: ActionTypes.API_ERROR,
      payload: error as Error,
    };
  }
}

export async function createCase(
  form: Form,
  callback: (newCase: Case) => void
): Promise<Action> {
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
      type: ActionTypes.CREATE_CASE,
      payload: flattenedNewCase,
    };
  } catch (error) {
    console.log("create case api error", error);
    return {
      type: ActionTypes.API_ERROR,
      payload: error as Error,
    };
  }
}

export function deleteCase(caseId: string): Action {
  return {
    type: ActionTypes.DELETE_CASE,
    payload: caseId,
  };
}

async function checkSymmetricKeyExistsForCase(caseData: Case) {
  const currentForm = caseData.forms[caseData.currentFormId];
  const key = await getStoredSymmetricKey(currentForm);
  return key !== null;
}

async function updateCaseForSymmetricKey(
  user: UserInterface,
  caseData: Case
): Promise<Case> {
  const { currentFormId } = caseData;
  const currentForm = caseData.forms[currentFormId];

  const newForm = await setupSymmetricKey(user, currentForm);
  const noChangesMade = await deepCompareEquals(currentForm, newForm);
  const shouldUpdate = !noChangesMade;

  if (shouldUpdate) {
    const serializedForm = serializeForm(newForm);

    const updateBody = {
      currentFormId,
      ...serializedForm,
    };

    const res = await put(`/cases/${caseData.id}`, JSON.stringify(updateBody));
    const resCode = res.status;

    if (resCode !== 200) {
      const message = `${resCode}: ${res.data?.data?.message}`;
      throw new Error(message);
    }

    return res.data.data.attributes;
  }

  return caseData;
}

export async function fetchCases(user: UserInterface): Promise<Action> {
  try {
    const response = await get("/cases");
    const rawCases: Case[] = response?.data?.data?.attributes?.cases;
    if (rawCases) {
      const readyCases = await rawCases.reduce(
        async (pendingProcessedCases, rawCase) => {
          const processedCases = await pendingProcessedCases;
          const { currentFormId } = rawCase;

          try {
            const currentForm = rawCase.forms[currentFormId];
            const deserializedForm = deserializeForm(currentForm);
            const decryptedForm = await decryptFormAnswers(
              user,
              deserializedForm
            );

            const rawCaseCopy = deepCopyViaJson(rawCase);
            const decryptedCase = {
              ...rawCaseCopy,
              forms: {
                ...rawCaseCopy.forms,
                [currentFormId]: decryptedForm,
              },
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

          return processedCases;
        },
        Promise.resolve({})
      );

      return {
        type: ActionTypes.FETCH_CASES,
        payload: readyCases,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      type: ActionTypes.API_ERROR,
      payload: error as Error,
    };
  }
  return {
    type: ActionTypes.FETCH_CASES,
    payload: {},
  };
}

export async function pollCase(
  user: UserInterface,
  caseData: Case
): Promise<Action> {
  const POLL_INTERVAL = 5000;

  await updateCaseForSymmetricKey(user, caseData);

  await wait(POLL_INTERVAL);

  const response = await get("/cases");
  const rawCases: Case[] = response?.data?.data?.attributes?.cases;

  if (rawCases) {
    const relevantCase = rawCases.find((rawCase) => rawCase.id === caseData.id);

    if (relevantCase) {
      const possiblySyncedCase = await updateCaseForSymmetricKey(
        user,
        relevantCase
      );
      const isSynced = await checkSymmetricKeyExistsForCase(possiblySyncedCase);

      return {
        type: ActionTypes.POLL_CASE,
        payload: { case: possiblySyncedCase, synced: isSynced },
      };
    }
  }

  return {
    type: ActionTypes.POLL_CASE,
    payload: {
      case: caseData,
      synced: false,
    },
  };
}
