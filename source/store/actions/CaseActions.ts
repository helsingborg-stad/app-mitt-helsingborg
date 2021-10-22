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
import {
  deepCompareEquals,
  deepCopyViaJson,
  filterAsync,
} from "../../helpers/Objects";
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

async function checkSymmetricKeyMissingForCase(caseData: Case) {
  const exists = await checkSymmetricKeyExistsForCase(caseData);
  return !exists;
}

function filterCasesWithoutSymmetricKey(cases: Case[]): Promise<Case[]> {
  return filterAsync(cases, checkSymmetricKeyMissingForCase);
}

async function caseRequiresSync(caseData: Case): Promise<boolean> {
  const currentForm = caseData.forms[caseData.currentFormId];
  const usesSymmetricKey = !!currentForm.encryption.symmetricKeyName;

  if (usesSymmetricKey) {
    return checkSymmetricKeyMissingForCase(caseData);
  }

  return false;
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

function handleCasePollingError(error: Error) {
  console.error("Error during case poll", error);
}

async function pollCasesForSymmetricSetup(
  user: UserInterface,
  cases: Case[]
): Promise<void> {
  const POLL_INTERVAL = 5000;

  await Promise.all(
    cases.map((caseData) => updateCaseForSymmetricKey(user, caseData))
  );

  await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));

  const response = await get("/cases");
  const rawCases: Case[] = response?.data?.data?.attributes?.cases;

  if (rawCases) {
    const pollCasesIds = cases.map((caseData) => caseData.id);
    const updatedPollingCases = rawCases.filter((caseData) =>
      pollCasesIds.includes(caseData.id)
    );

    await Promise.all(
      updatedPollingCases.map((caseData) =>
        updateCaseForSymmetricKey(user, caseData)
      )
    );

    const casesStillNeedingSync = await filterCasesWithoutSymmetricKey(
      updatedPollingCases
    );

    if (casesStillNeedingSync.length > 0) {
      pollCasesForSymmetricSetup(user, casesStillNeedingSync).catch(
        handleCasePollingError
      );
    }
  }
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

      const casesAwaitingSync = await filterAsync(rawCases, caseRequiresSync);

      if (casesAwaitingSync.length > 0) {
        pollCasesForSymmetricSetup(user, casesAwaitingSync).catch(
          handleCasePollingError
        );
      }

      casesAwaitingSync.forEach((unsyncedCase) => {
        console.log("unsynced case", unsyncedCase.id, user.personalNumber);
      });

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
