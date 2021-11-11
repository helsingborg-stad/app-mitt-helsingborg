import { deepCopy } from "app/helpers/Objects";
import { NativeModules } from "react-native";
import {
  AnsweredForm,
  EncryptedAnswersWrapper,
  PossiblyEncryptedAnswers,
} from "../../types/Case";
import {
  CryptoNumber,
  EncryptionErrorStatus,
  EncryptionType,
  PossiblySerializedCryptoNumber,
  SerializedCryptoNumber,
} from "../../types/Encryption";

import StorageService from "../StorageService";

import {
  UserInterface,
  getPseudoKey,
  EncryptionException,
  createAndStorePrivateKey,
  generateSymmetricKey,
  getPublicKeyInForm,
  getStoredSymmetricKey,
  storeSymmetricKey,
} from "./EncryptionHelper";

const { Aes } = NativeModules;

const Params = {
  KEY_LENGTH: 16,
  IV_LENGTH: 16,
  SALT: "salt4D42bf960Sm1",
  SYMMETRIC_IV: "003d8999f6a4bb9800ed24b5d1846523",
  PBKDF2_ITERATIONS: 5000,
  PBKDF2_LENGTH: 256,
};

export function answersAreEncrypted(
  answers: PossiblyEncryptedAnswers
): answers is EncryptedAnswersWrapper {
  return !Array.isArray(answers);
}

export async function generateAesKey(
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
    const password = await Aes.randomKey(Params.KEY_LENGTH);

    const aesKey = await generateAesKey(
      password,
      Params.SALT,
      Params.PBKDF2_ITERATIONS,
      Params.PBKDF2_LENGTH
    );

    const initializationVector = await Aes.randomKey(Params.IV_LENGTH);

    aesEncryptor = { aesKey, initializationVector };
    await StorageService.saveData(storageKeyword, aesEncryptor);
  }

  return Aes.encrypt(
    text,
    aesEncryptor.aesKey,
    aesEncryptor.initializationVector
  );
}

export async function encryptWithSymmetricKey(
  forms: AnsweredForm,
  plaintextAnswers: string
): Promise<string> {
  const symmetricKey = await getStoredSymmetricKey(forms);
  const encryptedAnswers = await Aes.encrypt(
    plaintextAnswers,
    symmetricKey.toString(16).padStart(64, "0"),
    Params.SYMMETRIC_IV
  );
  return encryptedAnswers;
}

export async function encryptFormAnswers(
  user: UserInterface,
  forms: AnsweredForm
): Promise<AnsweredForm> {
  const canEncrypt = !answersAreEncrypted(forms.answers);

  const plaintextAnswers = JSON.stringify(forms.answers);

  const shouldUseSymmetricEncryption =
    forms.encryption.symmetricKeyName?.length > 0;

  if (shouldUseSymmetricEncryption) {
    if (canEncrypt) {
      const encryptedAnswers = await encryptWithSymmetricKey(
        forms,
        plaintextAnswers
      );
      forms.answers = { encryptedAnswers };
    }

    forms.encryption.type = EncryptionType.SYMMETRIC_KEY;
    return forms;
  }

  if (canEncrypt) {
    const encryptedAnswers = await encryptWithAesKey(user, plaintextAnswers);
    forms.answers = { encryptedAnswers };
  }

  forms.encryption.type = EncryptionType.PRIVATE_AES_KEY;

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
      EncryptionErrorStatus.MISSING_AES_KEY,
      "Did not find AES key in storage: The key was either lost or encrypt not called before trying decrypt."
    );
  }

  return Aes.decrypt(
    cipher,
    aesEncryptor.aesKey,
    aesEncryptor.initializationVector
  );
}

export async function decryptWithSymmetricKey(
  forms: AnsweredForm,
  encryptedAnswers: string
): Promise<string> {
  const symmetricKey = await getStoredSymmetricKey(forms);
  const decryptedAnswersRaw = await Aes.decrypt(
    encryptedAnswers,
    symmetricKey.toString(16).padStart(64, "0"),
    Params.SYMMETRIC_IV
  );
  return decryptedAnswersRaw;
}

export async function decryptFormAnswers(
  user: UserInterface,
  forms: AnsweredForm
): Promise<AnsweredForm> {
  if (forms.encryption.type === EncryptionType.PRIVATE_AES_KEY) {
    if (answersAreEncrypted(forms.answers)) {
      const { encryptedAnswers } = forms.answers;
      const decryptedAnswers = await decryptWithAesKey(user, encryptedAnswers);
      forms.answers = JSON.parse(decryptedAnswers);
    }

    forms.encryption.type = EncryptionType.DECRYPTED;

    return forms;
  }

  if (forms.encryption.type === EncryptionType.SYMMETRIC_KEY) {
    if (answersAreEncrypted(forms.answers)) {
      const { encryptedAnswers } = <EncryptedAnswersWrapper>forms.answers;
      const decryptedAnswersRaw = await decryptWithSymmetricKey(
        forms,
        encryptedAnswers
      );

      forms.answers = JSON.parse(decryptedAnswersRaw);
    }
    forms.encryption.type = EncryptionType.DECRYPTED;
  }

  return forms;
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

  if (!!ownPublicKey && !!otherUserPublicKey) {
    const gotSymmetricKey = await generateSymmetricKey(
      user,
      formsCopy,
      otherUserPublicKey
    );

    await storeSymmetricKey(gotSymmetricKey, formsCopy);

    console.log(
      "generated symmetric key",
      forms.encryption.symmetricKeyName,
      user.personalNumber
    );
  }

  return formsCopy;
}

function isCryptoNumber(
  obj: PossiblySerializedCryptoNumber
): obj is CryptoNumber {
  return typeof obj === "number";
}

function isSerializedCryptoNumber(
  obj: PossiblySerializedCryptoNumber
): obj is SerializedCryptoNumber {
  return typeof obj === "string";
}

export function serializeCryptoNumber(
  number: CryptoNumber
): SerializedCryptoNumber {
  return number.toString();
}

export function deserializeCryptoNumber(
  serializedNumber: SerializedCryptoNumber
): CryptoNumber {
  return Number(serializedNumber);
}

export function serializeCryptoNumberIfPossible(
  number: PossiblySerializedCryptoNumber
): SerializedCryptoNumber {
  if (isCryptoNumber(number)) {
    return serializeCryptoNumber(number);
  }
  return number;
}

export function deserializeCryptoNumberIfPossible(
  number: PossiblySerializedCryptoNumber
): CryptoNumber {
  if (isSerializedCryptoNumber(number)) {
    return deserializeCryptoNumber(number);
  }
  return number;
}

export function serializeForm(form: AnsweredForm): AnsweredForm {
  const formCopy = deepCopy(form);
  const { encryption } = formCopy;

  if (encryption.primes !== undefined) {
    encryption.primes.G = serializeCryptoNumberIfPossible(encryption.primes.G);
    encryption.primes.P = serializeCryptoNumberIfPossible(encryption.primes.P);
  }

  if (encryption.publicKeys !== undefined) {
    const existingKeys = encryption.publicKeys;
    const objectKeys = Object.keys(encryption.publicKeys);
    encryption.publicKeys = objectKeys.reduce((obj, key) => {
      const existingValue = existingKeys[key];

      if (existingValue !== null) {
        const serializedValue = serializeCryptoNumberIfPossible(existingValue);
        return {
          ...obj,
          [key]: serializedValue,
        };
      }

      return {
        ...obj,
        [key]: null,
      };
    }, {} as typeof encryption.publicKeys);
  }

  return formCopy;
}

export function deserializeForm(form: AnsweredForm): AnsweredForm {
  const formCopy = deepCopy(form);
  const { encryption } = formCopy;

  if (encryption.primes !== undefined) {
    encryption.primes.G = deserializeCryptoNumberIfPossible(
      encryption.primes.G
    );
    encryption.primes.P = deserializeCryptoNumberIfPossible(
      encryption.primes.P
    );
  }

  if (encryption.publicKeys !== undefined) {
    const existingKeys = encryption.publicKeys;
    const objectKeys = Object.keys(encryption.publicKeys);
    encryption.publicKeys = objectKeys.reduce((obj, key) => {
      const existingValue = existingKeys[key];

      if (existingValue !== null) {
        const serializedValue =
          deserializeCryptoNumberIfPossible(existingValue);
        return {
          ...obj,
          [key]: serializedValue,
        };
      }

      return {
        ...obj,
        [key]: null,
      };
    }, {} as typeof encryption.publicKeys);
  }

  return formCopy;
}
