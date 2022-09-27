export enum EncryptionType {
  DECRYPTED = "decrypted",
  PASSWORD = "password",
}

export enum EncryptionErrorStatus {
  INVALID_ENCRYPTION_TYPE = "invalidEncryptionType",
  INVALID_CASE = "invalidCase",
  INVALID_INPUT = "invalidInput",
  INVALID_STORAGE = "invalidStorage",
  REQUIRES_PARAMS = "requiresParams",
}
export type EncryptionExceptionStatus = EncryptionErrorStatus | null;

type CryptoNumber = number;
type SerializedCryptoNumber = string;
type PossiblySerializedCryptoNumber = CryptoNumber | SerializedCryptoNumber;
type CiperAlgorithm = "aes-256-cbc";
export interface AesModule {
  pbkdf2: (
    password: string,
    salt: string,
    cost: number,
    lengthInBits: number
  ) => Promise<string>;
  encrypt: (
    text: string,
    key: string,
    iv: string,
    algorithm: CiperAlgorithm
  ) => Promise<string>;
  decrypt: (
    ciphertext: string,
    key: string,
    iv: string,
    algorithm: CiperAlgorithm
  ) => Promise<string>;
  hmac256: (ciphertext: string, key: string) => Promise<string>;
  randomKey: (lengthInBytes: number) => Promise<string>;
  sha1: (text: string) => Promise<string>;
  sha256: (text: string) => Promise<string>;
  sha512: (text: string) => Promise<string>;
}

declare module "react-native" {
  interface NativeModulesStatic {
    Aes: AesModule;
  }
}

export interface EncryptionDetails {
  type: EncryptionType;
  symmetricKeyName?: string;
  encryptionKeyId?: string;
  primes?: {
    P: PossiblySerializedCryptoNumber;
    G: PossiblySerializedCryptoNumber;
  };
  publicKeys?: Record<string, PossiblySerializedCryptoNumber | null>;
}

export interface EncryptionExceptionInterface extends Error {
  status: EncryptionExceptionStatus;
}
