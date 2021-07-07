import StorageService from '../StorageService';

export interface UserInterface {
  personalNumber: string;
}

export interface FormsInterface {
  answers: { encryptedAnswers: string };
  encryption: {
    type: string;
    publicKey: {
      P: number;
      G: number;
      symmetricKeyName: string;
      publicKeys: Record<number, undefined | string>;
    };
  };
}

export function EncryptionException(message: string) {
  this.message = message;
  this.name = 'EncryptionException';
}

export function getPublicKeyInForm(personalNumber: string, forms: FormsInterface) {
  return forms.encryption.publicKey.publicKeys[personalNumber];
}

function getSymmetricKeyStorageKeyword(forms: FormsInterface) {
  return `${forms.encryption.publicKey.symmetricKeyName}`;
}

export async function getStoredSymmetricKey(forms: FormsInterface) {
  const storageKeyword = getSymmetricKeyStorageKeyword(forms);
  const symmetricKey = await StorageService.getData(storageKeyword);
  return Number(symmetricKey);
}

export async function storeSymmetricKey(symmetricKey: number, forms: FormsInterface) {
  const storageKeyword = getSymmetricKeyStorageKeyword(forms);
  await StorageService.saveData(storageKeyword, symmetricKey.toString());
}

// Prof of concept, will be replaced with Diffie-Hellman library.
export function getPseudoKey(G: number, privateKey: number, P: number) {
  if (privateKey === 1) {
    return G;
  }

  return G ** privateKey % P;
}

export function getPseudoRandomInteger() {
  const min = 1;
  const max = 10;
  return Math.floor(min + Math.random() * (max - min));
}

export async function createAndStorePrivateKey(user: UserInterface, forms: FormsInterface) {
  const privateKey = getPseudoRandomInteger();

  await StorageService.saveData(
    `aesPrivateKey${user.personalNumber}${forms.encryption.publicKey.symmetricKeyName}`,
    JSON.stringify({ privateKey })
  );

  return privateKey;
}
