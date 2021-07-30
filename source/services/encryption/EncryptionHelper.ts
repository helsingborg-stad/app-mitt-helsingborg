import { AnsweredForm, EncryptedAnswersWrapper } from "../../types/Case";
import {
  CryptoNumber,
  EncryptionDetails,
  KeyPair,
  SerializedCryptoNumber,
} from "../../types/Encryption";
import {
  getSymmetricKey,
  getSymmetricKeyStoreKey,
  getSymmetricPrivateKey,
  createAndStoreSymmetricPrivateKey,
  getPseudoKey,
  decryptAesByEncryptorID,
  createAndStoreSymmetricKey,
  deserializeCryptoNumber,
  serializeCryptoNumber,
  encryptAesByEncryptorID,
  encryptAes,
  decryptAes,
} from "./EncryptionService";

// #region Helpers

/**
 * Type used to describe a partial property update to a form object
 * when decrypting form answers.
 */
export type FormAnswersAndEncryption = Pick<
  AnsweredForm,
  "answers" | "encryption"
>;

export type EncryptionPublicKeysUpdate = Pick<EncryptionDetails, "publicKeys">;

/**
 * Get the symmetric key name used for encryption from a form object.
 * @param form Form to get key name from.
 * @returns The symmetric key name, or `null` if not found.
 */
export function getSymmetricKeyNameFromForm(form: AnsweredForm): string | null {
  return form.encryption.symmetricKeyName ?? null;
}

/**
 * Get the store key used to store a symmetric key in persistent storage from a form.
 * @param form Form containing the symmetric key name.
 * @returns The store key used to identify the symmetric key in persistent storage.
 */
export function getSymmetricKeyStoreKeyByForm(form: AnsweredForm): string {
  const symmetricKeyName = getSymmetricKeyNameFromForm(form);
  return getSymmetricKeyStoreKey(symmetricKeyName);
}

/**
 * Get the symmetric key used for encrypting a form.
 * @param form Form to get symmetric key name from.
 * @returns The symmetric key, or `null` if it could not be found/loaded.
 */
export async function getSymmetricKeyByForm(
  form: AnsweredForm
): Promise<CryptoNumber> {
  const symmetricKeyName = getSymmetricKeyNameFromForm(form);

  if (symmetricKeyName === null) {
    return null;
  }

  return getSymmetricKey(symmetricKeyName);
}

/**
 * Get the public key from a form.
 * @param form Form to get key from.
 * @param personalNumber Personal number of the person to get the public key of.
 * @returns The public key for the person with the given personal number in the
 *  given form, or `null` if not available.
 */
export function getPublicKeyFromForm(
  form: AnsweredForm,
  personalNumber: string
): SerializedCryptoNumber | null {
  return form.encryption.publicKeys[personalNumber] ?? null;
}

/**
 * Attempts to get the key pair used for symmetric key generation. If the key pair (specifically
 * the public key) does not exist a new one is created and the associated private key is
 * stored on the device.
 * @param personalNumber Personal number used as unique ID for the symmetric key.
 * @param form Form containing encryption details used for the symmetric key.
 * @returns The key pair for the user with the given personal number used for symmetric key generation.
 */
export async function getOrCreateSymmetricKeyPair(
  personalNumber: string,
  form: AnsweredForm
): Promise<KeyPair> {
  const symmetricKeyName = getSymmetricKeyNameFromForm(form);
  const existingPublicKey = getPublicKeyFromForm(form, personalNumber);

  if (existingPublicKey) {
    const existingPrivateKey = await getSymmetricPrivateKey(
      personalNumber,
      symmetricKeyName
    );

    return [Number(existingPublicKey), existingPrivateKey];
  }

  const newPrivateKey = await createAndStoreSymmetricPrivateKey(
    personalNumber,
    symmetricKeyName
  );
  const newPublicKey = getPseudoKey(
    deserializeCryptoNumber(form.encryption.primes.G),
    newPrivateKey,
    deserializeCryptoNumber(form.encryption.primes.P)
  );

  return [newPublicKey, newPrivateKey];
}

/**
 * Check if a given form is currently containing encrypted answers.
 * @param form Form to check.
 * @returns `true` if form has encrypted answers, `false` otherwise.
 */
export function isFormEncrypted(form: AnsweredForm): boolean {
  return !Array.isArray(form.answers);
}

/**
 * Encrypts the form answers of a given form.
 *
 * The encryption method used  (e.g. private AES key, common symmetric key etc.)
 * is determined by the contents of the form.
 * @param personalNumber Personal number used as encryptor ID used for encrypting the
 *  answers (when method is private AES).
 * @param form The form containing the (decrypted) answers.
 * @returns An object containing updated form properties which can be merged with the form object.
 *  If form is already encrypted an empty object is returned.
 * @throws {Error} if encryption failed.
 */
export async function encryptFormAnswers(
  personalNumber: string,
  form: AnsweredForm
): Promise<FormAnswersAndEncryption> {
  const isEncrypted = isFormEncrypted(form);

  if (!isEncrypted) {
    const plaintextAnswers = JSON.stringify(form.answers);

    const symmetricKeyName = getSymmetricKeyNameFromForm(form);
    if (symmetricKeyName !== null) {
      // Method is common symmetric key (i.e. case with co-applicant)
      const symmetricKey = await getSymmetricKeyByForm(form);

      if (symmetricKey === null) {
        throw new Error("Symmetric key not found (required for encryption).");
      }

      const encryptedAnswers = await encryptAes(
        plaintextAnswers,
        symmetricKey.toString(16),
        "003d8999f6a4bb9800ed24b5d1846523"
      );

      return <FormAnswersAndEncryption>{
        answers: { encryptedAnswers },
        encryption: {
          type: "symmetricKey",
        },
      };
    }

    // Method is private AES (single applicant)
    const encryptedAnswers = await encryptAesByEncryptorID(
      personalNumber,
      plaintextAnswers
    );
    return <FormAnswersAndEncryption>{
      answers: { encryptedAnswers },
      encryption: {
        type: "privateAesKey",
      },
    };
  }
  return <FormAnswersAndEncryption>{};
}

/**
 * Decrypts the form answers of a given form.
 *
 * The decryption method used  (e.g. private AES key, common symmetric key etc.)
 * is determined by the contents of the form.
 * @param personalNumber Personal number used as encryptor ID used for decrypting the
 *  answers (when method is private AES).
 * @param form The form containing the (encrypted) answers.
 * @returns An object containing updated form properties which can be merged with the form object.
 *  If form is already decrypted an empty object is returned.
 * @throws {Error} if decryption failed, or no decryption method for the determined encryption
 *  type is implemented.
 */
export async function decryptFormAnswers(
  personalNumber: string,
  form: AnsweredForm
): Promise<FormAnswersAndEncryption> {
  const isEncrypted = isFormEncrypted(form);

  if (isEncrypted) {
    const { encryptedAnswers } = <EncryptedAnswersWrapper>form.answers;

    const encryptionType = form.encryption.type;

    switch (encryptionType) {
      case "privateAesKey": {
        const decryptedAnswersRaw = await decryptAesByEncryptorID(
          personalNumber,
          encryptedAnswers
        );
        const decryptedAnswers = JSON.parse(decryptedAnswersRaw);

        return <FormAnswersAndEncryption>{
          answers: decryptedAnswers,
          encryption: {
            type: "decrypted",
          },
        };
      }
      case "symmetricKey": {
        const symmetricKey = await getSymmetricKeyByForm(form);

        if (symmetricKey === null) {
          throw new Error("Symmetric key not found (required for encryption).");
        }

        const decryptedAnswersRaw = await decryptAes(
          encryptedAnswers,
          symmetricKey.toString(16),
          "003d8999f6a4bb9800ed24b5d1846523"
        );
        const decryptedAnswers = JSON.parse(decryptedAnswersRaw);

        return <FormAnswersAndEncryption>{
          answers: decryptedAnswers,
          encryption: {
            type: "decrypted",
          },
        };
      }
      default: {
        throw new Error(
          `No decryption method implemented for "${encryptionType}"`
        );
      }
    }
  }

  return <FormAnswersAndEncryption>{};
}

/**
 * Merge a form object with new answers and encryption data.
 * @param form Base form object.
 * @param answersAndEncryption Object with updated answers and encryption properties.
 * @returns A new form object with the merged properties.
 */
export function mergeFormAnswersAndEncryption(
  form: AnsweredForm,
  answersAndEncryption: FormAnswersAndEncryption
): AnsweredForm {
  // Note: some properties from form are still copied by reference. Ideally maybe
  // this should be a deep clone.
  return {
    ...form,
    answers: answersAndEncryption.answers,
    encryption: {
      ...form.encryption,
      ...answersAndEncryption.encryption,
    },
  };
}

/**
 * Attempt to setup the Diffie-Hellman symmetric key used for encryption. This requires
 * the co-applicant public key to be available to fully succeed.
 * @param personalNumber Personal number used for setting up the symmetric key.
 * @param form Form containing the required encryption details.
 * @returns Updated encryption details.
 */
export async function setupSymmetricKey(
  personalNumber: string,
  form: AnsweredForm
): Promise<EncryptionPublicKeysUpdate> {
  const encryptionRelevantPersonalNumbers = Object.keys(
    form.encryption.publicKeys
  );
  const coApplicantPersonalNumber = encryptionRelevantPersonalNumbers.find(
    (pno) => pno !== personalNumber
  );

  if (!coApplicantPersonalNumber) {
    throw new Error("Missing expected co-applicant in list of public keys");
  }

  const coApplicantPublicKey = getPublicKeyFromForm(
    form,
    coApplicantPersonalNumber
  );

  const ownKeyPair = await getOrCreateSymmetricKeyPair(personalNumber, form);

  if (coApplicantPublicKey !== null) {
    const symmetricKeyName = getSymmetricKeyNameFromForm(form);
    await createAndStoreSymmetricKey(
      ownKeyPair[1],
      deserializeCryptoNumber(coApplicantPublicKey),
      deserializeCryptoNumber(form.encryption.primes.P),
      symmetricKeyName
    );
  }

  return <EncryptionPublicKeysUpdate>{
    publicKeys: {
      [personalNumber]: serializeCryptoNumber(ownKeyPair[0]),
    },
  };
}

// #endregion Helpers
