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

export async function encryptWithAesKey(user: User, text: string): Promise<string> {
  const storageKeyword = `${user.personalNumber}AesKey`;

  let aesEncryptor = await StorageService.getData(storageKeyword);

  if (!aesEncryptor) {
    const password = await Aes.randomKey(16);
    // Salt will be updated in future real.
    const aesKey = await generateAesKey(password, 'salt4D42bf960Sm1', 5000, 256);

    const initializationVector = await Aes.randomKey(16);

    aesEncryptor = { aesKey, initializationVector };
    await StorageService.saveData(storageKeyword, aesEncryptor);
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
