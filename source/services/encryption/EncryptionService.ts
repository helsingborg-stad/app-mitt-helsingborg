import { NativeModules } from 'react-native';

import StorageService from '../StorageService';

const { Aes } = NativeModules;

interface User {
  personalNumber: string;
}

function EncryptionException(message: string) {
  this.message = message;
  this.name = 'EncryptionException';
}

async function generateAesKey(
  password: string,
  salt: string,
  cost: number,
  length: number
): Promise<string> {
  return Aes.pbkdf2(password, salt, cost, length);
}

const AES_SALT = 'salt4D42bf960Sm1';
const AES_COST = 5000;
const AES_LENGTH = 256;

const getStorageKeyword = (user: User) => `${user.personalNumber}AesKey`;

export async function setAesEncryptor(user: User, password: string) {
  const storageKeyword = getStorageKeyword(user);

  const aesKey = await generateAesKey(password, AES_SALT, AES_COST, AES_LENGTH);
  const aesEncryptor = { aesKey, initializationVector: aesKey };

  await StorageService.saveData(storageKeyword, aesEncryptor);
}

export async function getAesEncryptor(user: User) {
  const storageKeyword = getStorageKeyword(user);

  return await StorageService.getData(storageKeyword);
}

export async function removeAesEncryptor(user: User) {
  await StorageService.removeData(getStorageKeyword(user));
}

export async function encryptWithAesKey(user: User, text: string): Promise<string> {
  const storageKeyword = getStorageKeyword(user);

  let aesEncryptor = await StorageService.getData(storageKeyword);

  if (!aesEncryptor) {
    // const password = await Aes.randomKey(16);
    // // Salt will be updated in future real.
    // const aesKey = await generateAesKey(password, AES_SALT, AES_COST, AES_LENGTH);
    //
    // const initializationVector = await Aes.randomKey(16);
    //
    // aesEncryptor = { aesKey, initializationVector };
    // await StorageService.saveData(storageKeyword, aesEncryptor);

    const password = await Aes.randomKey(16);
    await setAesEncryptor(user, password);

    aesEncryptor = await StorageService.getData(storageKeyword);
  }

  return await Aes.encrypt(text, aesEncryptor.aesKey, aesEncryptor.initializationVector);
}

export async function decryptWithAesKey(user: User, cipher: string): Promise<string> {
  const storageKey = `${user.personalNumber}AesKey`;
  const aesEncryptor = await StorageService.getData(storageKey);

  if (!aesEncryptor) {
    throw new EncryptionException(
      'Did not find AES key in storage: The key was either lost or encrypt not called before trying decrypt.'
    );
  }

  return Aes.decrypt(cipher, aesEncryptor.aesKey, aesEncryptor.initializationVector);
}
