import type { EncryptionDetails } from "../../types/Encryption";
import type { UserInterface } from "./CaseEncryptionHelper";

export interface EncryptionContext {
  user?: UserInterface;
  encryptionDetails?: EncryptionDetails;
  extra?: Record<string, unknown>;
}

export interface EncryptionStrategyDependencies {
  getData(key: string): Promise<string | null>;
  saveData(key: string, payload: string): Promise<void>;
}

export enum EncryptionPossibility {
  CAN_ENCRYPT,
  REQUIRES_PARAMS,
}

export interface IEncryptionStrategy<TParams> {
  encrypt(params: TParams, payload: string): Promise<string>;
  decrypt(params: TParams, payload: string): Promise<string>;
  getPossibilityToEncrypt(
    context: EncryptionContext,
    dependencies: EncryptionStrategyDependencies
  ): Promise<EncryptionPossibility>;
  canDecrypt(
    context: EncryptionContext,
    dependencies: EncryptionStrategyDependencies
  ): Promise<boolean>;
  getParamsID(context: EncryptionContext): string;
  getParams(
    context: EncryptionContext,
    dependencies: EncryptionStrategyDependencies
  ): Promise<TParams | null>;
}
