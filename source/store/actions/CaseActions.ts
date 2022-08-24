import type { Form } from "../../types/FormTypes";
import type {
  Action,
  CaseUpdate,
  UpdateCaseBody,
  AddCoApplicantParameters,
} from "../../types/CaseContext";
import { ActionTypes } from "../../types/CaseContext";
import { get, post, put } from "../../helpers/ApiRequest";
import { convertAnswersToArray } from "../../helpers/CaseDataConverter";
import type { Case } from "../../types/Case";
import { ApplicationStatusType } from "../../types/Case";
import type { UserInterface } from "../../services/encryption/CaseEncryptionHelper";
import { getCurrentForm } from "../../services/encryption/CaseEncryptionHelper";
import { CaseEncryptionService } from "../../services/encryption";
import { wrappedDefaultStorage } from "../../services/storage/StorageService";
import { to } from "../../helpers/Misc";
import { PasswordStrategy } from "../../services/encryption/PasswordStrategy";
import { filterAsync } from "../../helpers/Objects";

const { NOT_STARTED } = ApplicationStatusType;

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
    const res = await put(
      `/cases/${caseId}`,
      JSON.stringify(updateCaseRequestBody)
    );
    const { id, attributes } = res.data.data;
    const flatUpdatedCase = { id, updatedAt: Date.now(), ...attributes };
    if (callback) {
      await callback(flatUpdatedCase);
    }

    flatUpdatedCase.forms[formId] = await encryptionService.decryptForm(
      flatUpdatedCase.forms[formId]
    );

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

async function getCasesThatShouldGeneratePin(
  user: UserInterface,
  cases: Case[]
): Promise<Case[]> {
  const notStartedCases = cases.filter((caseData) =>
    caseData.status.type.includes(NOT_STARTED)
  );
  const freshCasesWithCoapplicant = notStartedCases.filter((caseData) => {
    const currentForm = getCurrentForm(caseData);
    return !!currentForm.encryption.symmetricKeyName;
  });

  const casesWhereUserIsMainApplicant = freshCasesWithCoapplicant.filter(
    (caseData) => {
      const selfPerson = caseData.persons.find(
        (person) => person.personalNumber === user.personalNumber
      );
      return selfPerson?.role === "applicant";
    }
  );

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

async function setupPinForCases(user: UserInterface, cases: Case[]) {
  return cases.map(async (caseData) => {
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
}

export async function fetchCases(user: UserInterface): Promise<Action> {
  try {
    const response = await get("/cases");
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
  const addCoApplicantResult = await put(
    `/viva-cases/${caseId}/persons`,
    JSON.stringify(parameters)
  );

  if (addCoApplicantResult?.status !== 200) {
    const errorMessage =
      addCoApplicantResult?.data?.data?.message ?? "Något gick fel";
    throw new Error(errorMessage);
  }

  return {
    type: ActionTypes.UPDATE_CASE,
    payload: addCoApplicantResult.data.data.attributes.caseItem,
  };
}
