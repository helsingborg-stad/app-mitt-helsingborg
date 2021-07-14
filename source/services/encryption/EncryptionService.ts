import { NativeModules } from 'react-native';

import StorageService from '../StorageService';

import {
  FormsInterface,
  UserInterface,
  getPseudoKey,
  EncryptionException,
  getPublicKeyInForm,
  storeSymmetricKey,
  createAndStorePrivateKey,
  generateSymmetricKey,
} from './EncryptionHelper';

const { Aes } = NativeModules;

async function generateAesKey(
  password: string,
  salt: string,
  cost: number,
  length: number
): Promise<string> {
  return Aes.pbkdf2(password, salt, cost, length);
}

export async function encryptWithAesKey(user: UserInterface, text: string): Promise<string> {
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

export async function encryptFormAnswers(user: UserInterface, forms: FormsInterface) {
  const encryptedAnswers = await encryptWithAesKey(user, JSON.stringify(forms.answers));

  forms.answers = { encryptedAnswers };
  forms.encryption.type = 'privateAesKey';

  return forms;
}

export async function decryptWithAesKey(user: UserInterface, cipher: string): Promise<string> {
  const storageKey = `${user.personalNumber}AesKey`;
  const aesEncryptor = await StorageService.getData(storageKey);

  if (!aesEncryptor) {
    throw new EncryptionException(
      'Did not find AES key in storage: The key was either lost or encrypt not called before trying decrypt.'
    );
  }

  return Aes.decrypt(cipher, aesEncryptor.aesKey, aesEncryptor.initializationVector);
}

export async function decryptFormAnswers(user: UserInterface, forms: FormsInterface) {
  if (forms.encryption.type === 'privateAesKey') {
    const { encryptedAnswers } = forms.answers;
    const decryptedAnswers = await decryptWithAesKey(user, encryptedAnswers);

    forms.answers = JSON.parse(decryptedAnswers);
    forms.encryption.type = 'decrypted';

    return forms;
  }
}

export async function setupSymmetricKey(user: UserInterface, forms: FormsInterface) {
  const otherUserPersonalNumber = Object.keys(forms.encryption.publicKey.publicKeys).filter(
    (key) => key !== user.personalNumber
  )[0];

  const otherUserPublicKey = getPublicKeyInForm(otherUserPersonalNumber, forms);
  let ownPublicKey = getPublicKeyInForm(user.personalNumber, forms);

  if (!ownPublicKey) {
    const privateKey = await createAndStorePrivateKey(user, forms);
    ownPublicKey = getPseudoKey(
      forms.encryption.publicKey.G,
      privateKey,
      forms.encryption.publicKey.P
    );

    forms.encryption.publicKey.publicKeys[user.personalNumber] = ownPublicKey;
  }

  if (typeof ownPublicKey !== 'undefined' && typeof otherUserPublicKey !== 'undefined') {
    const gotSymmetricKey = await generateSymmetricKey(user, forms, otherUserPublicKey);

    await storeSymmetricKey(gotSymmetricKey, forms);
  }

  return forms;
}
