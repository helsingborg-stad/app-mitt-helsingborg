import uuid from "react-native-uuid";

import { allSettled, isRejectedSettledPromise } from "../../helpers/promise";
import { get, isRequestError, post, put } from "../../helpers/ApiRequest";
import { convertAnswersToArray } from "../../helpers/CaseDataConverter";
import { filterAsync } from "../../helpers/Objects";
import { to } from "../../helpers/Misc";

import { getCurrentForm } from "../../services/encryption/CaseEncryptionHelper";
import { PasswordStrategy } from "../../services/encryption/PasswordStrategy";
import { wrappedDefaultStorage } from "../../services/storage/StorageService";
import { CaseEncryptionService } from "../../services/encryption";
import { ApplicationStatusType } from "../../types/Case";
import { ActionTypes } from "../../types/CaseContext";

import type { UserInterface } from "../../services/encryption/CaseEncryptionHelper";
import type { Case } from "../../types/Case";
import type {
  Action,
  AddCoApplicantParameters,
  CaseUpdate,
  UpdateCaseBody,
} from "../../types/CaseContext";
import type { Form } from "../../types/FormTypes";

const {
  NOT_STARTED,
  NEW_APPLICATION,
  ACTIVE_RANDOM_CHECK_REQUIRED_VIVA,
  ACTIVE_SUBMITTED_RANDOM_CHECK_VIVA,
  ACTIVE_COMPLETION_REQUIRED_VIVA,
  ACTIVE_SUBMITTED_COMPLETION,
} = ApplicationStatusType;

function setupPinForCases(user: UserInterface, cases: Case[]): Promise<void[]> {
  const promises = cases.map(async (caseData) => {
    const currentForm = getCurrentForm(caseData);
    const pin = await PasswordStrategy.generateAndSaveBasicPinPassword(
      {
        encryptionDetails: currentForm.encryption,
        user,
      },
      wrappedDefaultStorage
    );
    console.log(`generated pin ${pin} for case ${caseData.id}`);
  });

  return Promise.all(promises);
}

async function getCasesThatShouldGeneratePin(
  user: UserInterface,
  cases: Case[]
): Promise<Case[]> {
  const casesNeedingPin = cases.filter(
    (caseData) =>
      [
        NOT_STARTED,
        NEW_APPLICATION,
        ACTIVE_RANDOM_CHECK_REQUIRED_VIVA,
        ACTIVE_SUBMITTED_RANDOM_CHECK_VIVA,
        ACTIVE_COMPLETION_REQUIRED_VIVA,
        ACTIVE_SUBMITTED_COMPLETION,
      ].filter((statusType) => caseData.status.type.includes(statusType))
        .length > 0
  );

  const casesWhereUserIsMainApplicant = casesNeedingPin.filter((caseData) => {
    const selfPerson = caseData.persons.find(
      (person) => person.personalNumber === user.personalNumber
    );
    return selfPerson?.role === "applicant";
  });

  const casesWithoutGeneratedPin = await filterAsync(
    casesWhereUserIsMainApplicant,
    async (caseData) => {
      const currentForm = getCurrentForm(caseData);
      const hasPassword = await PasswordStrategy.hasPassword(
        {
          user,
          encryptionDetails: currentForm.encryption,
        },
        wrappedDefaultStorage
      );

      return !hasPassword;
    }
  );

  return casesWithoutGeneratedPin;
}

function shouldCaseBeSubmitted(caseData: Case): boolean {
  return caseData.status.type.includes(
    ApplicationStatusType.ACTIVE_SIGNATURE_COMPLETED
  );
}

async function putCaseUpdate(
  user: UserInterface,
  id: string,
  updateCaseRequestBody: UpdateCaseBody
) {
  const encryptionService = new CaseEncryptionService(
    wrappedDefaultStorage,
    async () => user
  );

  const updateResponse = await put<{ id: string; attributes: Case }>(
    `/cases/${id}`,
    JSON.stringify(updateCaseRequestBody)
  );

  if (isRequestError(updateResponse)) {
    throw new Error(updateResponse.message);
  }

  const { attributes } = updateResponse.data.data;
  const flatUpdatedCase = { ...attributes };

  flatUpdatedCase.forms[updateCaseRequestBody.currentFormId] =
    await encryptionService.decryptForm(
      flatUpdatedCase.forms[updateCaseRequestBody.currentFormId]
    );

  return flatUpdatedCase;
}

function submitCase(user: UserInterface, caseData: Case): Promise<Case> {
  console.log("(re)submitting", caseData.id);
  const currentForm = caseData.forms[caseData.currentFormId];
  const formId = caseData.currentFormId;

  const updateCaseRequestBody: UpdateCaseBody = {
    answers: currentForm.answers,
    currentFormId: formId,
    currentPosition: currentForm.currentPosition,
    encryption: currentForm.encryption,
  };

  return putCaseUpdate(user, caseData.id, updateCaseRequestBody);
}

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
  callback: (updatedCase: Case) => Promise<Action>
): Promise<Action> {
  const encryptionService = new CaseEncryptionService(
    wrappedDefaultStorage,
    async () => user
  );
  let updateCaseRequestBody: UpdateCaseBody = {
    answers: convertAnswersToArray(answerObject, formQuestions),
    currentPosition,
    currentFormId: formId,
    encryption,
  };

  if (encryptAnswers) {
    const encryptedForm = await encryptionService.encryptForm(
      updateCaseRequestBody
    );
    updateCaseRequestBody = {
      ...updateCaseRequestBody,
      ...encryptedForm,
    };
  }

  if (signature?.success) {
    updateCaseRequestBody.signature = signature;
  }

  try {
    const flatUpdatedCase = await putCaseUpdate(
      user,
      caseId,
      updateCaseRequestBody
    );
    if (callback) {
      await callback(flatUpdatedCase);
    }

    return {
      type: ActionTypes.UPDATE_CASE,
      payload: flatUpdatedCase,
    };
  } catch (error) {
    console.error(`Update current case error: ${error}`);
    return {
      type: ActionTypes.API_ERROR,
      payload: error as Error,
    };
  }
}

export async function createCase(
  user: UserInterface,
  form: Form,
  callback: (newCase: Case) => void
): Promise<Action> {
  const keyId = uuid.v4();
  const body = {
    provider: form.provider,
    statusType: NOT_STARTED,
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
        encryption: {
          type: "decrypted",
          symmetricKeyName: keyId,
          encryptionKeyId: keyId,
        },
      },
    },
    details: {},
  };

  try {
    const response = await post<{ attributes: Case; id: string }>(
      "/cases",
      JSON.stringify(body)
    );

    if (isRequestError(response)) {
      throw new Error(response.message);
    }

    const newCase = response.data.data.attributes;

    await setupPinForCases(user, [newCase]);

    callback(newCase);

    return {
      type: ActionTypes.CREATE_CASE,
      payload: newCase,
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

export async function fetchCases(user: UserInterface): Promise<Action> {
  try {
    const response = await get<{ attributes: { cases: Case[] } }>("/cases");

    if (isRequestError(response)) {
      throw new Error(response.message);
    }

    const rawCases: Case[] = response?.data?.data?.attributes?.cases;

    if (rawCases) {
      const encryptionService = new CaseEncryptionService(
        wrappedDefaultStorage,
        async () => user
      );

      const readyCases: Case[] = await Promise.all(
        rawCases.map(async (caseData: Case) => {
          const [decryptError, decryptedCase] = await to(
            encryptionService.decrypt(caseData)
          );
          if (decryptError) {
            console.warn(
              `unable to decrypt case with id ${caseData.id}`,
              decryptError
            );
          }

          return (decryptedCase ?? caseData) as Case;
        })
      );
      const casesToGeneratePinFor = await getCasesThatShouldGeneratePin(
        user,
        readyCases
      );
      await setupPinForCases(user, casesToGeneratePinFor);

      const casesToSubmit = readyCases.filter(shouldCaseBeSubmitted);
      const submitCaseWithUser = (caseData: Case) => submitCase(user, caseData);
      const submitResults = await allSettled(
        casesToSubmit.map(submitCaseWithUser)
      );
      const failedToSubmit = submitResults.filter(isRejectedSettledPromise);
      if (failedToSubmit.length > 0) {
        console.warn(`failed to (re)submit ${failedToSubmit.length} cases`);
        failedToSubmit.forEach(({ reason }) => console.error(reason));
      }

      const casesMappedById = readyCases.reduce<Record<string, Case>>(
        (mappedCases, caseData) => ({
          ...mappedCases,
          [caseData.id]: caseData,
        }),
        {}
      );

      return {
        type: ActionTypes.FETCH_CASES,
        payload: casesMappedById,
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

export async function addCaseCoApplicant(
  caseId: string,
  parameters: AddCoApplicantParameters
): Promise<{ type: ActionTypes.UPDATE_CASE; payload: Case }> {
  const addCoApplicantResult = await put<{
    message: string;
    attributes: { caseItem: Case };
  }>(`/viva-cases/${caseId}/persons`, JSON.stringify(parameters));

  if (isRequestError(addCoApplicantResult)) {
    throw new Error(addCoApplicantResult.message);
  }

  if (addCoApplicantResult.status !== 200) {
    const errorMessage =
      addCoApplicantResult?.data?.data?.message || "Något gick fel";
    throw new Error(errorMessage);
  }

  return {
    type: ActionTypes.UPDATE_CASE,
    payload: addCoApplicantResult.data.data.attributes.caseItem,
  };
}
