import StorageService from '../StorageService';

export function EncryptionException(message: string) {
  this.message = message;
  this.name = 'EncryptionException';
}

export function getPublicKeyInForm(personalNumber, forms) {
  return forms.encryption.publicKey.publicKeys[personalNumber];
}

function getSymmetricKeyStorageKeyword(forms) {
  return `${forms.encryption.publicKey.symmetricKeyName}`;
}

export async function getStoredSymmetricKey(forms) {
  const storageKeyword = getSymmetricKeyStorageKeyword(forms);
  const symmetricKey = await StorageService.getData(storageKeyword);
  return Number(symmetricKey);
}

export async function storeSymmetricKey(symmetricKey, forms) {
  const storageKeyword = getSymmetricKeyStorageKeyword(forms);
  await StorageService.saveData(storageKeyword, symmetricKey.toString());
}

// Prof of concept, will be replaced with elliptic curves.
export function getPseudoKey(G, privateKey, P) {
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
