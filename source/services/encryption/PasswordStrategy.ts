import { NativeModules } from "react-native";
import { EncryptionErrorStatus } from "../../types/Encryption";
import { EncryptionException } from "./CaseEncryptionHelper";
import { DeviceLocalAESParams } from "./DeviceLocalAESStrategy";
import {
  EncryptionContext,
  EncryptionDependencies,
  EncryptionPossibility,
  IEncryptionStrategy,
} from "./EncryptionStrategy";

const { Aes } = NativeModules;

export interface PasswordParams {
  password: string;
}

async function generateAESParamsFromPassword(
  password: string
): Promise<DeviceLocalAESParams> {
  const key = await Aes.pbkdf2(password, "salt4D42bf960Sm1", 5000, 256);
  const iv = "003d8999f6a4bb9800ed24b5d1846523";

  return { key, iv };
}

export async function generateRandomPin(): Promise<string> {
  const pin = Array(4)
    .fill(0)
    .map(() => Math.floor(Math.random() * 10))
    .join("");
  return pin;
}

export interface IPasswordStrategy extends IEncryptionStrategy<PasswordParams> {
  generateAndSaveBasicPinPassword(
    context: EncryptionContext,
    dependencies: EncryptionDependencies
  ): Promise<string>;
  providePassword(
    password: string,
    context: EncryptionContext,
    dependencies: EncryptionDependencies
  ): Promise<void>;
  getPassword(
    context: EncryptionContext,
    dependencies: EncryptionDependencies
  ): Promise<string | null>;
  hasPassword(
    context: EncryptionContext,
    dependencies: EncryptionDependencies
  ): Promise<boolean>;
}

export const PasswordStrategy: IPasswordStrategy = {
  async encrypt(params: PasswordParams, payload: string): Promise<string> {
    const aesParams = await generateAESParamsFromPassword(params.password);
    return Aes.encrypt(payload, aesParams.key, aesParams.iv);
  },

  async decrypt(params: PasswordParams, payload: string): Promise<string> {
    const aesParams = await generateAESParamsFromPassword(params.password);
    return Aes.decrypt(payload, aesParams.key, aesParams.iv);
  },

  async getPossibilityToEncrypt(
    context: EncryptionContext,
    dependencies: EncryptionDependencies
  ): Promise<EncryptionPossibility> {
    const params = await this.getParams(context, dependencies);
    if (params !== null) {
      return EncryptionPossibility.CAN_ENCRYPT;
    }

    return EncryptionPossibility.REQUIRES_PARAMS;
  },

  async canDecrypt(
    context: EncryptionContext,
    dependencies: EncryptionDependencies
  ): Promise<boolean> {
    const params = await this.getParams(context, dependencies);
    return params !== null;
  },

  getParamsID(context: EncryptionContext): string {
    const paramsID = context.encryptionDetails?.symmetricKeyName;

    if (!paramsID) {
      throw new EncryptionException(
        EncryptionErrorStatus.INVALID_INPUT,
        "unable to get params ID"
      );
    }

    return paramsID;
  },

  async getParams(
    context: EncryptionContext,
    dependencies: EncryptionDependencies
  ): Promise<PasswordParams | null> {
    const paramsId = this.getParamsID(context);
    const params = await dependencies.storage.getData(paramsId);

    if (!params) {
      return null;
    }

    return JSON.parse(params);
  },

  async generateAndSaveBasicPinPassword(
    context: EncryptionContext,
    dependencies: EncryptionDependencies
  ): Promise<string> {
    const pin = await generateRandomPin();
    const paramsId = this.getParamsID(context);
    const params: PasswordParams = {
      password: pin,
    };
    await dependencies.storage.saveData(paramsId, JSON.stringify(params));
    return pin;
  },

  async getPassword(
    context: EncryptionContext,
    dependencies: EncryptionDependencies
  ): Promise<string | null> {
    const params = await this.getParams(context, dependencies);
    return params?.password ?? null;
  },

  async hasPassword(
    context: EncryptionContext,
    dependencies: EncryptionDependencies
  ): Promise<boolean> {
    const password = await this.getPassword(context, dependencies);
    return password !== null;
  },

  async providePassword(
    password: string,
    context: EncryptionContext,
    dependencies: EncryptionDependencies
  ): Promise<void> {
    const paramsId = this.getParamsID(context);
    const existingParams = await this.getParams(context, dependencies);

    if (existingParams) {
      throw new EncryptionException(
        EncryptionErrorStatus.INVALID_INPUT,
        `Password already exists for id ${paramsId}`
      );
    }

    const params: PasswordParams = {
      password,
    };
    await dependencies.storage.saveData(paramsId, JSON.stringify(params));
  },
};