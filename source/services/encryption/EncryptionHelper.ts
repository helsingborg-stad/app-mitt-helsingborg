import StorageService from '../StorageService';

export function EncryptionException(message: string) {
  this.message = message;
  this.name = 'EncryptionException';
}

export function getPublicKeyInForm(personalNumber, forms) {
  return forms.encryption.publicKey.publicKeys[personalNumber];
}

export async function getStoredSymmetricKey(symmetricKeyName) {
  const symmetricKey = await StorageService.getData(symmetricKeyName);
  return Number(symmetricKey);
}
