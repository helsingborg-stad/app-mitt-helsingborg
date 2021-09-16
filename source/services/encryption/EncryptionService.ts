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

export function getSecureRandom(): CryptoNumber {
  // TODO: Replace with actual secure random
  const min = 1;
  const max = 10;
  return Math.floor(min + Math.random() * (max - min));
}

export function generatePasswordBasedKey(
  password: string,
  salt: string,
  cost: number,
  length: number
): Promise<string> {
  return Aes.pbkdf2(password, salt, cost, length);
}

export function serializeCryptoNumber(value: CryptoNumber): SerializedCryptoNumber {
  return String(value);
}

export function deserializeCryptoNumber(value: SerializedCryptoNumber): CryptoNumber {
  return Number(value);
}

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

export function getAesEncryptorStoreKey(id: string): string {
  return `aesEncryptor-${id}`;
}

export async function createAesEncryptor(): Promise<AesEncryptor> {
  const password = await Aes.randomKey(16);
  // Salt will be updated in future real.
  const aesKey = await generatePasswordBasedKey(password, 'salt4D42bf960Sm1', 5000, 256);

  const initializationVector = await Aes.randomKey(16);
  const aesEncryptor: AesEncryptor = { aesKey, initializationVector };
  return aesEncryptor;
}

export async function storeAesEncryptor(id: string, aesEncryptor: AesEncryptor): Promise<void> {
  const storeKey = getAesEncryptorStoreKey(id);
  await StorageService.saveData(storeKey, JSON.stringify(aesEncryptor));
}

export async function createAndStoreAesEncryptor(id: string): Promise<AesEncryptor> {
  const aesEncryptor = await createAesEncryptor();
  await storeAesEncryptor(id, aesEncryptor);
  return aesEncryptor;
}

export async function getAesEncryptor(id: string): Promise<AesEncryptor | null> {
  const storeKey = getAesEncryptorStoreKey(id);
  const aesEncryptorRaw = await StorageService.getData(storeKey);
  return JSON.parse(aesEncryptorRaw);
}

export function encryptAes(plainText: string, key: string, iv: string): Promise<string> {
  return Aes.encrypt(plainText, key, iv);
}

export function decryptAes(cipherText: string, key: string, iv: string): Promise<string> {
  return Aes.decrypt(cipherText, key, iv);
}

export function encryptWithEncryptor(
  aesEncryptor: AesEncryptor,
  plainText: string
): Promise<string> {
  return encryptAes(plainText, aesEncryptor.aesKey, aesEncryptor.initializationVector);
}

export function decryptWithEncryptor(
  aesEncryptor: AesEncryptor,
  cipherText: string
): Promise<string> {
  return decryptAes(cipherText, aesEncryptor.aesKey, aesEncryptor.initializationVector);
}

export async function encryptAesByEncryptorID(
  encryptorId: string,
  plainText: string
): Promise<string> {
  const existingEncryptor = await getAesEncryptor(encryptorId);
  const aesEncryptor = existingEncryptor ?? (await createAndStoreAesEncryptor(encryptorId));

  return encryptWithEncryptor(aesEncryptor, plainText);
}

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

export function getSymmetricPrivateKeyStoreKey(id: string, symmetricKeyName: string): string {
  return `aesPrivateKey${id}-${symmetricKeyName}`;
}

export function createSymmetricPrivateKey(): CryptoNumber {
  return getSecureRandom();
}

export async function storeSymmetricPrivateKey(
  id: string,
  symmetricKeyName: string,
  privateKey: CryptoNumber
): Promise<void> {
  const storeKey = getSymmetricPrivateKeyStoreKey(id, symmetricKeyName);
  const serializedPrivateKey = serializeCryptoNumber(privateKey);
  await StorageService.saveData(storeKey, serializedPrivateKey);
}

export async function createAndStoreSymmetricPrivateKey(
  id: string,
  symmetricKeyName: string
): Promise<CryptoNumber> {
  const newPrivateKey = createSymmetricPrivateKey();
  await storeSymmetricPrivateKey(id, symmetricKeyName, newPrivateKey);
  return newPrivateKey;
}

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

export function getSymmetricKeyStoreKey(symmetricKeyName: string): string {
  return `aesSymmetricKey${symmetricKeyName}`;
}

export function createSymmetricKey(
  ownPrivateKey: CryptoNumber,
  otherPublicKey: CryptoNumber,
  P: CryptoNumber
): CryptoNumber {
  return getPseudoKey(otherPublicKey, ownPrivateKey, P);
}

export async function storeSymmetricKey(
  symmetricKeyName: string,
  symmetricKey: CryptoNumber
): Promise<void> {
  const storeKey = getSymmetricKeyStoreKey(symmetricKeyName);
  const serializedKey = serializeCryptoNumber(symmetricKey);
  await StorageService.saveData(storeKey, serializedKey);
}

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

export async function getSymmetricKey(symmetricKeyName: string): Promise<CryptoNumber> {
  const storeKey = getSymmetricKeyStoreKey(symmetricKeyName);
  const symmetricKeyRaw = await StorageService.getData(storeKey);

  if (!symmetricKeyRaw) {
    return null;
  }

  return deserializeCryptoNumber(symmetricKeyRaw);
}
