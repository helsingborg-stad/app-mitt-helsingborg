import { AnsweredForm } from "../../types/Case";
import {
  EncryptionExceptionInterface,
  EncryptionExceptionStatus,
} from "../../types/Encryption";
import StorageService from "../StorageService";

export interface UserInterface {
  personalNumber: string;
}

export class EncryptionException
  extends Error
  implements EncryptionExceptionInterface
{
  status: EncryptionExceptionStatus = null;

  constructor(status: EncryptionExceptionStatus, message: string) {
    super(message);

    // See https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, EncryptionException.prototype);

    this.name = "EncryptionException";
    this.status = status;
  }
}

export function getPublicKeyInForm(
  personalNumber: string,
  forms: AnsweredForm
): number {
  return forms.encryption.publicKeys[personalNumber];
}

function getSymmetricKeyStorageKeyword(forms: AnsweredForm): string {
  return forms.encryption.symmetricKeyName;
}

function getPrivateKeyStorageKeyword(
  user: UserInterface,
  forms: AnsweredForm
): string {
  return `aesPrivateKey${user.personalNumber}${forms.encryption.symmetricKeyName}`;
}

export async function getStoredSymmetricKey(
  forms: AnsweredForm
): Promise<number> {
  const storageKeyword = getSymmetricKeyStorageKeyword(forms);
  const symmetricKey = await StorageService.getData(storageKeyword);
  return Number(symmetricKey);
}

export async function storeSymmetricKey(
  symmetricKey: number,
  forms: AnsweredForm
): Promise<void> {
  const storageKeyword = getSymmetricKeyStorageKeyword(forms);
  await StorageService.saveData(storageKeyword, symmetricKey.toString());
}

// Proof of concept, will be replaced with Diffie-Hellman library.
export function getPseudoKey(G: number, privateKey: number, P: number): number {
  if (privateKey === 1) {
    return G;
  }

  return G ** privateKey % P;
}

// Proof of concept, will be replaced by encryption library.
export function getPseudoRandomInteger(): number {
  const min = 1;
  const max = 10;
  return Math.floor(min + Math.random() * (max - min));
}

export async function createAndStorePrivateKey(
  user: UserInterface,
  forms: AnsweredForm
): Promise<number> {
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
): Promise<number> {
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
