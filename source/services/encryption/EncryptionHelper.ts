import { AnsweredForm } from "../../types/Case";
import StorageService from "../StorageService";

export interface UserInterface {
  personalNumber: string;
}

export function EncryptionException(message: string) {
  this.message = message;
  this.name = "EncryptionException";
}

export function getPublicKeyInForm(
  personalNumber: string,
  forms: AnsweredForm
) {
  return forms.encryption.publicKeys[personalNumber];
}

function getSymmetricKeyStorageKeyword(forms: AnsweredForm) {
  return forms.encryption.symmetricKeyName;
}

function getPrivateKeyStorageKeyword(user: UserInterface, forms: AnsweredForm) {
  return `aesPrivateKey${user.personalNumber}${forms.encryption.symmetricKeyName}`;
}

export async function getStoredSymmetricKey(forms: AnsweredForm) {
  const storageKeyword = getSymmetricKeyStorageKeyword(forms);
  const symmetricKey = await StorageService.getData(storageKeyword);
  return Number(symmetricKey);
}

export async function storeSymmetricKey(
  symmetricKey: number,
  forms: AnsweredForm
) {
  const storageKeyword = getSymmetricKeyStorageKeyword(forms);
  await StorageService.saveData(storageKeyword, symmetricKey.toString());
}

// Proof of concept, will be replaced with Diffie-Hellman library.
export function getPseudoKey(G: number, privateKey: number, P: number) {
  if (privateKey === 1) {
    return G;
  }

  return G ** privateKey % P;
}

// Proof of concept, will be replaced by encryption library.
export function getPseudoRandomInteger() {
  const min = 1;
  const max = 10;
  return Math.floor(min + Math.random() * (max - min));
}

export async function createAndStorePrivateKey(
  user: UserInterface,
  forms: AnsweredForm
) {
  const privateKey = getPseudoRandomInteger();

  await StorageService.saveData(
    getPrivateKeyStorageKeyword(user, forms),
    JSON.stringify({ privateKey })
  );

  return privateKey;
}

export async function generateSymmetricKey(
  user: UserInterface,
  forms: AnsweredForm,
  otherUserPublicKey: number
) {
  let ownPrivateKey = await StorageService.getData(
    getPrivateKeyStorageKeyword(user, forms)
  );
  ownPrivateKey = JSON.parse(ownPrivateKey);

  return getPseudoKey(
    otherUserPublicKey,
    ownPrivateKey.privateKey,
    forms.encryption.primes.P
  );
}
