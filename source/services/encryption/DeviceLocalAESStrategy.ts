import { NativeModules } from "react-native";
import { ALGO_SALT, ALGO_ROUNDS, ALGO_LENGTH } from "./constants";
import type {
  EncryptionContext,
  EncryptionStrategyDependencies,
  IEncryptionStrategy,
} from "./EncryptionStrategy";
import { EncryptionPossibility } from "./EncryptionStrategy";

const { Aes } = NativeModules;

export interface DeviceLocalAESParams {
  key: string;
  iv: string;
}

async function createAesParams(): Promise<DeviceLocalAESParams> {
  const randomBytes = await Aes.randomKey(16);

  const key = await Aes.pbkdf2(
    randomBytes,
    ALGO_SALT,
    ALGO_ROUNDS,
    ALGO_LENGTH
  );

  const iv = await Aes.randomKey(16);

  return { key, iv };
}

export const DeviceLocalAESStrategy: IEncryptionStrategy<DeviceLocalAESParams> =
  {
    encrypt(params: DeviceLocalAESParams, payload: string): Promise<string> {
      return Aes.encrypt(payload, params.key, params.iv, "aes-256-cbc");
    },

    decrypt(params: DeviceLocalAESParams, payload: string): Promise<string> {
      return Aes.decrypt(payload, params.key, params.iv, "aes-256-cbc");
    },

    async getPossibilityToEncrypt(): Promise<EncryptionPossibility> {
      return EncryptionPossibility.CAN_ENCRYPT;
    },

    async canDecrypt(
      context: EncryptionContext,
      dependencies: EncryptionStrategyDependencies
    ): Promise<boolean> {
      return this.getParams(context, dependencies) !== null;
    },

    getParamsID(context: EncryptionContext): string {
      return `${context.user?.personalNumber}DeviceLocalKey`;
    },

    async getParams(
      context: EncryptionContext,
      dependencies: EncryptionStrategyDependencies
    ): Promise<DeviceLocalAESParams | null> {
      const paramsId = this.getParamsID(context);
      const params = await dependencies.storage.getData(paramsId);

      if (!params) {
        const newParams = await createAesParams();
        await dependencies.storage.saveData(
          paramsId,
          JSON.stringify(newParams)
        );
        return newParams;
      }
      return JSON.parse(params);
    },
  };
