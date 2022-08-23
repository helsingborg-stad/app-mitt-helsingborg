/* eslint-disable max-classes-per-file */
import type { AnsweredForm, Case } from "../../types/Case";
import type { EncryptionDetails } from "../../types/Encryption";
import { EncryptionErrorStatus, EncryptionType } from "../../types/Encryption";
import type {
  EncryptionContext,
  EncryptionStrategyDependencies,
} from "./EncryptionStrategy";
import { EncryptionPossibility } from "./EncryptionStrategy";
import type { UserInterface } from "./CaseEncryptionHelper";
import {
  getEncryptionStrategyByType,
  EncryptionException,
  getValidEncryptionForForm,
  getCurrentForm,
  getDataToEncryptFromForm,
  getEncryptionFromForm,
  makeFormWithEncryptedData,
  makeCaseWithNewForm,
  getDataToDecryptFromForm,
  getEncryptionStrategyFromForm,
  makeFormWithDecryptedData,
} from "./CaseEncryptionHelper";

interface ICaseEncryptionServiceStatic {
  new (
    dependencies: EncryptionStrategyDependencies,
    getUserFunc: () => Promise<UserInterface>
  ): ICaseEncryptionService;
}

export interface ICaseEncryptionService {
  encrypt(caseData: Case): Promise<Case>;
  decrypt(caseData: Case): Promise<Case>;
  encryptForm(form: AnsweredForm): Promise<AnsweredForm>;
  decryptForm(form: AnsweredForm): Promise<AnsweredForm>;
}

export const CaseEncryptionService: ICaseEncryptionServiceStatic = class CaseEncryptionService
  implements ICaseEncryptionService
{
  getUserFunc: () => Promise<UserInterface>;

  dependencies: EncryptionStrategyDependencies;

  constructor(
    dependencies: EncryptionStrategyDependencies,
    getUserFunc: () => Promise<UserInterface>
  ) {
    this.getUserFunc = getUserFunc;
    this.dependencies = dependencies;
  }

  async buildEncryptionContextByDetails(
    encryptionDetails: EncryptionDetails
  ): Promise<EncryptionContext> {
    const user = await this.getUserFunc();
    return { user, encryptionDetails };
  }

  buildEncryptionContextFromForm(
    form: AnsweredForm
  ): Promise<EncryptionContext> {
    const encryptionDetails = getEncryptionFromForm(form);
    return this.buildEncryptionContextByDetails(encryptionDetails);
  }

  buildEncryptionContext(caseData: Case): Promise<EncryptionContext> {
    const currentForm = getCurrentForm(caseData);
    return this.buildEncryptionContextFromForm(currentForm);
  }

  async encrypt(caseData: Case): Promise<Case> {
    const form = getCurrentForm(caseData);
    const newForm = await this.encryptForm(form);
    return makeCaseWithNewForm(caseData, newForm);
  }

  async decrypt(caseData: Case): Promise<Case> {
    const form = getCurrentForm(caseData);
    const newForm = await this.decryptForm(form);
    return makeCaseWithNewForm(caseData, newForm);
  }

  async encryptForm(form: AnsweredForm): Promise<AnsweredForm> {
    const validEncryption = getValidEncryptionForForm(form);

    const dataToEncrypt = getDataToEncryptFromForm(form);

    const strategy = getEncryptionStrategyByType(validEncryption.type);

    const encryptionContext = await this.buildEncryptionContextFromForm(form);

    const encryptionPossibility = await strategy.getPossibilityToEncrypt(
      encryptionContext,
      this.dependencies
    );

    if (encryptionPossibility === EncryptionPossibility.REQUIRES_PARAMS) {
      throw new EncryptionException(
        EncryptionErrorStatus.REQUIRES_PARAMS,
        `encrypting form of type ${form.encryption.type} requires additional params`
      );
    }

    if (encryptionPossibility !== EncryptionPossibility.CAN_ENCRYPT) {
      throw new EncryptionException(
        EncryptionErrorStatus.INVALID_INPUT,
        `unable to encrypt form of type ${form.encryption.type}`
      );
    }

    const encryptParams = await strategy.getParams(
      encryptionContext,
      this.dependencies
    );

    const encryptedData = await strategy.encrypt(encryptParams, dataToEncrypt);

    return makeFormWithEncryptedData(form, encryptedData, validEncryption);
  }

  async decryptForm(form: AnsweredForm): Promise<AnsweredForm> {
    const encryption = getEncryptionFromForm(form);

    if (encryption.type === EncryptionType.DECRYPTED) {
      return form;
    }

    const dataToDecrypt = getDataToDecryptFromForm(form);

    const strategy = getEncryptionStrategyFromForm(form);

    const encryptionContext = await this.buildEncryptionContextFromForm(form);

    const storageKey = strategy.getParamsID(encryptionContext);

    if (!storageKey) {
      throw new EncryptionException(
        EncryptionErrorStatus.INVALID_ENCRYPTION_TYPE,
        "no param ID"
      );
    }

    if (!this.dependencies) {
      throw new EncryptionException(
        EncryptionErrorStatus.INVALID_STORAGE,
        "storage service is not valid"
      );
    }

    const decryptParamsPayload = await this.dependencies.getData(storageKey);

    if (!decryptParamsPayload) {
      throw new EncryptionException(
        EncryptionErrorStatus.REQUIRES_PARAMS,
        `params missing for key ${storageKey}`
      );
    }

    const decryptParams = JSON.parse(decryptParamsPayload);
    const decryptedData = await strategy.decrypt(decryptParams, dataToDecrypt);
    return makeFormWithDecryptedData(form, decryptedData);
  }
};
