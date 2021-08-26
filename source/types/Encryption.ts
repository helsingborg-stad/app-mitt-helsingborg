/**
 * Possible encryption methods.
 */
export type EncryptionType = "decrypted" | "privateAesKey" | "symmetricKey";

/**
 * Number type used for cryptographic numbers.
 */
export type CryptoNumber = number;

/**
 * Type for serialized CryptoNumber values compatible with JSON.
 */
export type SerializedCryptoNumber = string;

/**
 * Tuple for a public-private key pair.
 */
export type KeyPair = [CryptoNumber, CryptoNumber];

export type EncryptionExceptionStatus =
  | "missingAesKey"
  | "missingSymmetricKey"
  | "missingCoApplicantPublicKey"
  | "missingCoApplicantPersonalNumber"
  | "invalidEncryptionType"
  | null;

/**
 * react-native-aes-crypto types
 */
interface AesModule {
  pbkdf2: (
    password: string,
    salt: string,
    cost: number,
    length: number
  ) => Promise<string>;
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

/**
 * Internal details of the encryption used.
 */
export interface EncryptionDetails {
  /**
   * Type of encryption used, or `decrypted` if unencrypted.
   */
  type: EncryptionType;

  /**
   * Unique name when using a symmetric key. Usually takes the format of "[main applicant pno]:[co-applicant pno]".
   */
  symmetricKeyName?: string;

  /**
   * Prime numbers used for cryptography.
   */
  primes?: {
    /**
     * A number P used for cryptography.
     */
    P: SerializedCryptoNumber;

    /**
     * A number G which is a primitive root modulo P, used for cryptography.
     */
    G: SerializedCryptoNumber;
  };

  /**
   * Map containing the public keys of persons connected to this encryption setup.
   */
  publicKeys?: Record<string, SerializedCryptoNumber>;
}

/**
 * Aes configuration wrapper.
 */
export interface AesEncryptor {
  aesKey: string;
  initializationVector: string;
}

/**
 * Custom Error subclass used to provide additional encryption error data.
 */
export interface EncryptionExceptionInterface extends Error {
  /**
   * The status type of this error.
   */
  status: EncryptionExceptionStatus;
}

/**
 * The constructor for `EncryptionExceptionInterface`.
 */
export interface EncryptionExceptionConstructor {
  new (
    status: EncryptionExceptionStatus,
    message: string
  ): EncryptionExceptionInterface;
}
