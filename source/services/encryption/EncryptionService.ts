import { NativeModules } from "react-native";
import { AnsweredForm, EncryptedAnswersWrapper } from "../../types/Case";

import StorageService from "../StorageService";

import {
  UserInterface,
  getPseudoKey,
  EncryptionException,
  getPublicKeyInForm,
  storeSymmetricKey,
  createAndStorePrivateKey,
  generateSymmetricKey,
} from "./EncryptionHelper";

const { Aes } = NativeModules;

async function generateAesKey(
  password: string,
  salt: string,
  cost: number,
  length: number
): Promise<string> {
  return Aes.pbkdf2(password, salt, cost, length);
}

export async function encryptWithAesKey(
  user: UserInterface,
  text: string
): Promise<string> {
  const storageKeyword = `${user.personalNumber}AesKey`;

  let aesEncryptor = await StorageService.getData(storageKeyword);

  if (!aesEncryptor) {
    const password = await Aes.randomKey(16);
    // Salt will be updated in future real.
    const aesKey = await generateAesKey(
      password,
      "salt4D42bf960Sm1",
      5000,
      256
    );

    const initializationVector = await Aes.randomKey(16);

    aesEncryptor = { aesKey, initializationVector };
    await StorageService.saveData(storageKeyword, aesEncryptor);
  }

  return Aes.encrypt(
    text,
    aesEncryptor.aesKey,
    aesEncryptor.initializationVector
  );
}

export async function encryptFormAnswers(
  user: UserInterface,
  forms: AnsweredForm
): Promise<AnsweredForm> {
  const encryptedAnswers = await encryptWithAesKey(
    user,
    JSON.stringify(forms.answers)
  );

  forms.answers = { encryptedAnswers };
  forms.encryption.type = "privateAesKey";

  return forms;
}

export async function decryptWithAesKey(
  user: UserInterface,
  cipher: string
): Promise<string> {
  const storageKey = `${user.personalNumber}AesKey`;
  const aesEncryptor = await StorageService.getData(storageKey);

  if (!aesEncryptor) {
    throw new EncryptionException(
      "Did not find AES key in storage: The key was either lost or encrypt not called before trying decrypt."
    );
  }

  return Aes.decrypt(
    cipher,
    aesEncryptor.aesKey,
    aesEncryptor.initializationVector
  );
}

export async function decryptFormAnswers(
  user: UserInterface,
  forms: AnsweredForm
): Promise<AnsweredForm> {
  if (forms.encryption.type === "privateAesKey") {
    const { encryptedAnswers } = <EncryptedAnswersWrapper>forms.answers;
    const decryptedAnswers = await decryptWithAesKey(user, encryptedAnswers);

    forms.answers = JSON.parse(decryptedAnswers);
    forms.encryption.type = "decrypted";

    return forms;
  }
  return null;
}

export async function setupSymmetricKey(
  user: UserInterface,
  forms: AnsweredForm
): Promise<AnsweredForm> {
  // Ugly deep copy of forms.
  const formsCopy = JSON.parse(JSON.stringify(forms));

  const otherUserPersonalNumber = Object.keys(
    formsCopy.encryption.publicKeys
  ).filter((key) => key !== user.personalNumber)[0];

  const otherUserPublicKey = getPublicKeyInForm(
    otherUserPersonalNumber,
    formsCopy
  );
  let ownPublicKey = getPublicKeyInForm(user.personalNumber, formsCopy);

  if (!ownPublicKey) {
    const privateKey = await createAndStorePrivateKey(user, formsCopy);
    ownPublicKey = getPseudoKey(
      formsCopy.encryption.primes.G,
      privateKey,
      formsCopy.encryption.primes.P
    );

    formsCopy.encryption.publicKeys[user.personalNumber] = ownPublicKey;
  }

  if (
    typeof ownPublicKey !== "undefined" &&
    typeof otherUserPublicKey !== "undefined"
  ) {
    const gotSymmetricKey = await generateSymmetricKey(
      user,
      formsCopy,
      otherUserPublicKey
    );

    await storeSymmetricKey(gotSymmetricKey, formsCopy);
  }

  return formsCopy;
}
