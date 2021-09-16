import { NativeModules } from 'react-native';
import {
  AesEncryptor,
  CryptoNumber,
  SerializedCryptoNumber,
  EncryptionExceptionInterface,
  EncryptionExceptionConstructor,
  EncryptionExceptionStatus,
} from '../../types/Encryption';
import StorageService from '../StorageService';

const { Aes } = NativeModules;

// #region Utilities

/**
 * Error subclass with additional information for encryption errors.
 */
export const EncryptionException: EncryptionExceptionConstructor = class EncryptionException
  extends Error
  implements EncryptionExceptionInterface {
  status: EncryptionExceptionStatus = null;

  constructor(status: EncryptionExceptionStatus, message: string) {
    super(message);

    // See https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, EncryptionException.prototype);

    this.status = status;
  }
};

/**
 * Generate and return a random number suitable for cryptography.
 * @returns A cryptographically secure random number.
 */
export function getSecureRandom(): CryptoNumber {
  // TODO: Replace with actual secure random
  const min = 1;
  const max = 10;
  return Math.floor(min + Math.random() * (max - min));
}

/**
 * Generate a cryptographic key based on a password.
 * @param password Password used for encryption.
 * @param salt Salt used for encryption.
 * @param cost Iteration count/rounds used when generating the key.
 * @param length Length of key to generate.
 * @returns A promise that resolves to the newly generated key.
 */
export function generatePasswordBasedKey(
  password: string,
  salt: string,
  cost: number,
  length: number
): Promise<string> {
  return Aes.pbkdf2(password, salt, cost, length);
}

/**
 * Turn a cryptographic number into a format suitable for serializing (such as for JSON).
 * @param value Cryptographic number to serialize.
 * @returns Serialized form of the cryptographic number.
 */
export function serializeCryptoNumber(value: CryptoNumber): SerializedCryptoNumber {
  return String(value);
}

/**
 * Turn a serialized cryptographic number representation into a format suitable for mathematic operations.
 * @param value Serialized representation of a cryptographic number to deserialize.
 * @returns Cryptographic number.
 */
export function deserializeCryptoNumber(value: SerializedCryptoNumber): CryptoNumber {
  return Number(value);
}

/**
 * Compute a mixed cryptographic key following the Diffie-Hellman method.
 * @param G
 * @param privateKey
 * @param P
 * @returns A new cryptographic key derived from the supplied inputs.
 */
export function getPseudoKey(
  G: CryptoNumber,
  privateKey: CryptoNumber,
  P: CryptoNumber
): CryptoNumber {
  // Proof of concept, will be replaced with Diffie-Hellman library.
  if (privateKey === 1) {
    return G;
  }

  return G ** privateKey % P;
}

// #endregion Utilities

// #region AES / Encryptor

/**
 * Get the key used for persistent storage for a specific AesEncryptor object.
 * @param id Unique id used to distinguish multiple AesEncryptor objects in the same storage.
 * @returns Key used for persistent storage.
 */
export function getAesEncryptorStoreKey(id: string): string {
  return `aesEncryptor-${id}`;
}

/**
 * Create a new AesEncryptor object containing the properties needed for Aes encryption/decryption.
 * @returns A new AesEncryptor object.
 */
export async function createAesEncryptor(): Promise<AesEncryptor> {
  const password = await Aes.randomKey(16);
  // Salt will be updated in future real.
  const aesKey = await generatePasswordBasedKey(password, 'salt4D42bf960Sm1', 5000, 256);

  const initializationVector = await Aes.randomKey(16);
  const aesEncryptor: AesEncryptor = { aesKey, initializationVector };
  return aesEncryptor;
}

/**
 * Store the given AesEncryptor on the device for persistent use.
 * @param id ID to store this AesEncryptor as.
 * @param aesEncryptor AesEncryptor object to store.
 */
export async function storeAesEncryptor(id: string, aesEncryptor: AesEncryptor): Promise<void> {
  const storeKey = getAesEncryptorStoreKey(id);
  await StorageService.saveData(storeKey, JSON.stringify(aesEncryptor));
}

/**
 * Create, stores (for persistent use), and returns a new AesEncryptor object.
 * @param id ID to store the AesEncryptor as.
 * @returns The newly created AesEncryptor object.
 */
export async function createAndStoreAesEncryptor(id: string): Promise<AesEncryptor> {
  const aesEncryptor = await createAesEncryptor();
  await storeAesEncryptor(id, aesEncryptor);
  return aesEncryptor;
}

/**
 * Get a AesEncryptor from persistent storage.
 * @param id ID for the AesEncryptor object to load.
 * @returns A promise that resolves with the AesEncryptor object, or `null` if it could not be found/loaded.
 */
export async function getAesEncryptor(id: string): Promise<AesEncryptor | null> {
  const storeKey = getAesEncryptorStoreKey(id);
  const aesEncryptorRaw = await StorageService.getData(storeKey);
  return JSON.parse(aesEncryptorRaw);
}

/**
 * Encrypt string data using AES.
 * @param plainText String data to encrypt.
 * @param key Key to encrypt with.
 * @param iv Initialization Vector to encrypt with.
 * @returns Promise that resolves to the encrypted string data.
 */
export function encryptAes(plainText: string, key: string, iv: string): Promise<string> {
  return Aes.encrypt(plainText, key, iv);
}

/**
 * Decrypt string data using AES.
 * @param cipherText String data to decrypt.
 * @param key Key to decrypt with.
 * @param iv Initialization Vector to decrypt with.
 * @returns Promise that resolves to the decrypted string data.
 */
export function decryptAes(cipherText: string, key: string, iv: string): Promise<string> {
  return Aes.decrypt(cipherText, key, iv);
}

/**
 * Encrypt string data with a given AES encryptor.
 * @param aesEncryptor Encryptor to use.
 * @param plainText String data to encrypt.
 * @returns Promise that resolves to the encrypted cipher string data.
 */
export function encryptWithEncryptor(
  aesEncryptor: AesEncryptor,
  plainText: string
): Promise<string> {
  return encryptAes(plainText, aesEncryptor.aesKey, aesEncryptor.initializationVector);
}

/**
 * Decrypt string data with a given AES encryptor.
 * @param aesEncryptor Encryptor to use.
 * @param plainText String cipher data to decrypt.
 * @returns Promise that resolves to the decrypted plaintext string data.
 * @throws {EncryptionException} if decryption failed.
 */
export function decryptWithEncryptor(
  aesEncryptor: AesEncryptor,
  cipherText: string
): Promise<string> {
  return decryptAes(cipherText, aesEncryptor.aesKey, aesEncryptor.initializationVector);
}

/**
 * Encrypt string data with AES using an AesEncryptor by ID.
 * @param encryptorId ID of the AesEncryptor that will be used. If an encryptor with this ID does not
 *    exist a new one is created with this ID and stored in persistent storage for future use.
 * @param plainText Data to encrypt.
 * @returns Promise that resolves with the encrypted cipher text.
 */
export async function encryptAesByEncryptorID(
  encryptorId: string,
  plainText: string
): Promise<string> {
  const existingEncryptor = await getAesEncryptor(encryptorId);
  const aesEncryptor = existingEncryptor ?? (await createAndStoreAesEncryptor(encryptorId));

  return encryptWithEncryptor(aesEncryptor, plainText);
}

/**
 * Decrypt string data with AES using an AesEncryptor by ID.
 * @param encryptorId ID of the AesEncryptor that will be used. If an encryptor with this ID does not
 *    exist an Error is thrown.
 * @param cipherText String data to decrypt.
 * @returns A promise that resolves with the decrypted string data.
 * @throws {EncryptionException} if the AesEncryptor object could not be found/loaded, or decryption failed.
 */
export async function decryptAesByEncryptorID(
  encryptorId: string,
  cipherText: string
): Promise<string> {
  const existingEncryptor = await getAesEncryptor(encryptorId);

  if (!existingEncryptor) {
    throw new EncryptionException(
      'missingAesKey',
      'Did not find AES key in storage: The key was either lost or encrypt not called before trying decrypt.'
    );
  }

  return decryptWithEncryptor(existingEncryptor, cipherText);
}

// #endregion AES / Encryptor

// #region Symmetric Private Key

/**
 * Get the key used for persistent storage for a specific symmetric private key.
 * @param id Unique id used to distinguish multiple private keys in the same storage.
 * @param symmetricKeyName Base name for the symmetric key that is shared with any co-encryptors.
 * @returns Key used for persistent storage.
 */
export function getSymmetricPrivateKeyStoreKey(id: string, symmetricKeyName: string): string {
  return `aesPrivateKey${id}-${symmetricKeyName}`;
}

/**
 * Create a new cryptographic key suitable as the private key part of the symmetric key generation process.
 * @returns The new cryptographic key.
 */
export function createSymmetricPrivateKey(): CryptoNumber {
  return getSecureRandom();
}

/**
 * Store the given key as a symmetric private key for persistent use.
 * @param id Unique ID used to identify this private key in storage.
 * @param symmetricKeyName Unique ID shared among participants of the symmetric key.
 * @param privateKey The private key to store.
 */
export async function storeSymmetricPrivateKey(
  id: string,
  symmetricKeyName: string,
  privateKey: CryptoNumber
): Promise<void> {
  const storeKey = getSymmetricPrivateKeyStoreKey(id, symmetricKeyName);
  const serializedPrivateKey = serializeCryptoNumber(privateKey);
  await StorageService.saveData(storeKey, serializedPrivateKey);
}

/**
 * Create, stores (for persistent use), and returns a new private key suitable for symmetric key generation.
 * @param id Unique ID used to identify the private key in storage.
 * @param symmetricKeyName Unique ID shared among participants of the symmetric key.
 * @returns The newly created private key.
 */
export async function createAndStoreSymmetricPrivateKey(
  id: string,
  symmetricKeyName: string
): Promise<CryptoNumber> {
  const newPrivateKey = createSymmetricPrivateKey();
  await storeSymmetricPrivateKey(id, symmetricKeyName, newPrivateKey);
  return newPrivateKey;
}

/**
 * Get a symmetric private key from persistent storage.
 * @param id ID for the private key to load.
 * @param symmetricKeyName Unique ID shared among participants of the symmetric key.
 * @returns A promise that resolves with the private key, or `null` if it could not be found/loaded.
 */
export async function getSymmetricPrivateKey(
  id: string,
  symmetricKeyName: string
): Promise<CryptoNumber | null> {
  const storeKey = getSymmetricPrivateKeyStoreKey(id, symmetricKeyName);
  const symmetricPrivateKeyRaw = await StorageService.getData(storeKey);

  if (!symmetricPrivateKeyRaw) {
    return null;
  }

  return deserializeCryptoNumber(symmetricPrivateKeyRaw);
}

// #endregion Symmetric Private Key

// #region Symmetric Key

/**
 * Get the key used for persistent storage for the given symmetric key.
 * @param symmetricKeyName Base name for the symmetric key that is shared with any co-encryptors.
 * @returns Key used for persistent storage.
 */
export function getSymmetricKeyStoreKey(symmetricKeyName: string): string {
  return `aesSymmetricKey${symmetricKeyName}`;
}

/**
 * Creates a symmetric key given the inputs following the Diffie-Hellman method.
 * @param ownPrivateKey The active user's private key.
 * @param otherPublicKey The other user's public key.
 * @param P Shared prime number.
 * @returns The computed common symmetric key.
 */
export function createSymmetricKey(
  ownPrivateKey: CryptoNumber,
  otherPublicKey: CryptoNumber,
  P: CryptoNumber
): CryptoNumber {
  return getPseudoKey(otherPublicKey, ownPrivateKey, P);
}

/**
 * Store the given key as a symmetric key for persistent use.
 * @param symmetricKeyName Unique ID shared among participants of the symmetric key.
 * @param symmetricKey The key to store.
 */
export async function storeSymmetricKey(
  symmetricKeyName: string,
  symmetricKey: CryptoNumber
): Promise<void> {
  const storeKey = getSymmetricKeyStoreKey(symmetricKeyName);
  const serializedKey = serializeCryptoNumber(symmetricKey);
  await StorageService.saveData(storeKey, serializedKey);
}

/**
 * Create, stores (for persistent use), and returns a new symmetric key.
 * @param ownPrivateKey The active user's private key.
 * @param otherPublicKey The other user's public key.
 * @param P Shared prime number.
 * @param symmetricKeyName Unique ID shared among participants of the symmetric key.
 * @returns The newly created symmetric key.
 */
export async function createAndStoreSymmetricKey(
  ownPrivateKey: CryptoNumber,
  otherPublicKey: CryptoNumber,
  P: CryptoNumber,
  symmetricKeyName: string
): Promise<CryptoNumber> {
  const newSymmetricKey = createSymmetricKey(ownPrivateKey, otherPublicKey, P);
  await storeSymmetricKey(symmetricKeyName, newSymmetricKey);
  return newSymmetricKey;
}

/**
 * Get a symmetric key from persistent storage.
 * @param symmetricKeyName Unique ID shared among participants of the symmetric key.
 * @returns A promise that resolves with the symmetric key, or `null` if it could not be found/loaded.
 */
export async function getSymmetricKey(symmetricKeyName: string): Promise<CryptoNumber> {
  const storeKey = getSymmetricKeyStoreKey(symmetricKeyName);
  const symmetricKeyRaw = await StorageService.getData(storeKey);

  if (!symmetricKeyRaw) {
    return null;
  }

  return deserializeCryptoNumber(symmetricKeyRaw);
}

// #endregion Symmetric Key
