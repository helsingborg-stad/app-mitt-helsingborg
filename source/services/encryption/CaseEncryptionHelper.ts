import { IStorage } from "./CaseEncryptionService";
import {
  Answer,
  AnsweredForm,
  Case,
  EncryptedAnswersWrapper,
  PossiblyEncryptedAnswers,
} from "../../types/Case";
import {
  EncryptionDetails,
  EncryptionErrorStatus,
  EncryptionExceptionInterface,
  EncryptionExceptionStatus,
  EncryptionType,
} from "../../types/Encryption";
import { wrappedDefaultStorage } from "../StorageService";
import { DeviceLocalAESStrategy } from "./DeviceLocalAESStrategy";
import { IEncryptionStrategy } from "./EncryptionStrategy";
import { PasswordStrategy } from "./PasswordStrategy";

type StrategyMap = {
  [key in EncryptionType]?: IEncryptionStrategy<unknown>;
};
export interface UserInterface {
  personalNumber: string;
}
export class EncryptionException
  extends Error
  implements EncryptionExceptionInterface
{
  status: EncryptionExceptionStatus = null;

  constructor(status: EncryptionExceptionStatus, message: string) {
    super(message);

    // See https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, EncryptionException.prototype);

    this.name = "EncryptionException";
    this.status = status;
  }
}

const strategyMap: StrategyMap = {
  privateAesKey: DeviceLocalAESStrategy,
  password: PasswordStrategy,
};

export function getCurrentForm(caseData: Case): AnsweredForm {
  const currentForm = caseData.forms[caseData.currentFormId];

  if (!currentForm) {
    throw new EncryptionException(
      EncryptionErrorStatus.INVALID_CASE,
      `no current form for case with id ${caseData.id}`
    );
  }

  return currentForm;
}

export function answersAreEncrypted(
  answers: PossiblyEncryptedAnswers
): answers is EncryptedAnswersWrapper {
  return !Array.isArray(answers);
}

export function getEncryptionFromForm(form: AnsweredForm): EncryptionDetails {
  return form.encryption;
}

export function getEncryptionFromCase(caseData: Case): EncryptionDetails {
  if (!caseData) {
    throw new EncryptionException(
      EncryptionErrorStatus.INVALID_CASE,
      "invalid case"
    );
  }

  const currentForm = getCurrentForm(caseData);

  return getEncryptionFromForm(currentForm);
}

export function getValidEncryptionForForm(
  form: AnsweredForm
): EncryptionDetails {
  const current = getEncryptionFromForm(form);

  if (current.type !== EncryptionType.DECRYPTED) {
    return current;
  }

  if (current.symmetricKeyName) {
    return {
      ...current,
      type: EncryptionType.PASSWORD,
    };
  }

  return {
    ...current,
    type: EncryptionType.PRIVATE_AES_KEY,
  };
}

export function getEncryptionStrategyByType(
  encryptionType: EncryptionType
): IEncryptionStrategy<unknown> {
  const strategy = strategyMap[encryptionType];

  if (!strategy) {
    throw new EncryptionException(
      EncryptionErrorStatus.INVALID_ENCRYPTION_TYPE,
      `no encryption strategy for type ${encryptionType}`
    );
  }

  return strategy;
}

export function getEncryptionStrategyFromForm(
  form: AnsweredForm
): IEncryptionStrategy<unknown> {
  const encryptionDetails = getValidEncryptionForForm(form);
  return getEncryptionStrategyByType(encryptionDetails.type);
}

export function getDataToEncryptFromForm(form: AnsweredForm): string {
  if (answersAreEncrypted(form.answers)) {
    throw new EncryptionException(
      EncryptionErrorStatus.INVALID_INPUT,
      `form provided for encryption is already encrypted`
    );
  }

  return JSON.stringify(form.answers);
}

export function getDataToDecryptFromForm(form: AnsweredForm): string {
  if (!answersAreEncrypted(form.answers)) {
    throw new EncryptionException(
      EncryptionErrorStatus.INVALID_INPUT,
      `form provided for decryption is already decrypted`
    );
  }

  return form.answers.encryptedAnswers;
}

function makeFormWithNewAnswers(
  form: AnsweredForm,
  answers: PossiblyEncryptedAnswers,
  encryptionDetailEdits?: Partial<EncryptionDetails>
): AnsweredForm {
  const newForm: AnsweredForm = {
    ...form,
    answers,
    encryption: { ...form.encryption, ...encryptionDetailEdits },
  };

  return newForm;
}

export function makeFormWithEncryptedData(
  form: AnsweredForm,
  encryptedData: string,
  encryption: EncryptionDetails
): AnsweredForm {
  const newAnswers: EncryptedAnswersWrapper = {
    encryptedAnswers: encryptedData,
  };

  return makeFormWithNewAnswers(form, newAnswers, encryption);
}

export function makeFormWithDecryptedData(
  form: AnsweredForm,
  decryptedData: string
): AnsweredForm {
  const newAnswers: Answer[] = JSON.parse(decryptedData);

  if (!Array.isArray(newAnswers)) {
    throw new EncryptionException(
      EncryptionErrorStatus.INVALID_INPUT,
      `provided decryptedData is not an array (${typeof decryptedData})`
    );
  }

  return makeFormWithNewAnswers(form, newAnswers, {
    type: EncryptionType.DECRYPTED,
  });
}

export function makeCaseWithNewForm(caseData: Case, form: AnsweredForm): Case {
  return {
    ...caseData,
    forms: {
      ...caseData.forms,
      [caseData.currentFormId]: form,
    },
  };
}

export function getPasswordForForm(
  form: AnsweredForm,
  user: UserInterface,
  storage: IStorage = wrappedDefaultStorage
): Promise<string | null> {
  return PasswordStrategy.getPassword(
    {
      encryptionDetails: form.encryption,
      user,
    },
    { storage }
  );
}
