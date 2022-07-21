import type { EncryptionDetails } from "../../types/Encryption";
import type { UserInterface } from "./CaseEncryptionHelper";
import type { IStorage } from "./CaseEncryptionService";

export interface EncryptionContext {
  user?: UserInterface;
  encryptionDetails?: EncryptionDetails;
  extra?: Record<string, unknown>;
}

export interface EncryptionDependencies {
  storage: IStorage;
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
    dependencies: EncryptionDependencies
  ): Promise<EncryptionPossibility>;
  canDecrypt(
    context: EncryptionContext,
    dependencies: EncryptionDependencies
  ): Promise<boolean>;
  getParamsID(context: EncryptionContext): string;
  getParams(
    context: EncryptionContext,
    dependencies: EncryptionDependencies
  ): Promise<TParams | null>;
}
