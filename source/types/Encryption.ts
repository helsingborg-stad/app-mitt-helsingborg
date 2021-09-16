export type EncryptionType = 'decrypted' | 'privateAesKey' | 'symmetricKey';
export type CryptoNumber = number;
export type SerializedCryptoNumber = string;
export type KeyPair = [CryptoNumber, CryptoNumber];

export type EncryptionExceptionStatus =
  | 'missingAesKey'
  | 'missingSymmetricKey'
  | 'missingCoApplicantPublicKey'
  | 'missingCoApplicantPersonalNumber'
  | 'invalidEncryptionType'
  | null;

interface AesModule {
  pbkdf2: (password: string, salt: string, cost: number, length: number) => Promise<string>;
  encrypt: (text: string, key: string, iv: string) => Promise<string>;
  decrypt: (ciphertext: string, key: string, iv: string) => Promise<string>;
  hmac256: (ciphertext: string, key: string) => Promise<string>;
  randomKey: (length: number) => Promise<string>;
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
  primes?: {
    P: SerializedCryptoNumber;
    G: SerializedCryptoNumber;
  };
  publicKeys?: Record<string, SerializedCryptoNumber>;
}

export interface AesEncryptor {
  aesKey: string;
  initializationVector: string;
}

export interface EncryptionExceptionInterface extends Error {
  status: EncryptionExceptionStatus;
}

export interface EncryptionExceptionConstructor {
  new (status: EncryptionExceptionStatus, message: string): EncryptionExceptionInterface;
}
