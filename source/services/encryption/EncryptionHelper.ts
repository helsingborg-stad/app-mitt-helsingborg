import { AnsweredForm, EncryptedAnswersWrapper } from "../../types/Case";
import {
  CryptoNumber,
  EncryptionDetails,
  EncryptionExceptionInterface,
  EncryptionExceptionStatus,
  KeyPair,
  SerializedCryptoNumber,
} from "../../types/Encryption";
import {
  EncryptionException,
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

export type SymmetricSetupStatus = "ready" | EncryptionExceptionStatus;

export type UpdateFormEncryptionTuple = [SymmetricSetupStatus, AnsweredForm];

export type SetupSymmetricKeyTuple = [
  SymmetricSetupStatus,
  EncryptionPublicKeysUpdate
];

/**
 * Updates a Form with new public key(s).
 * @param form Base Form object.
 * @param encryptionPublicKeysUpdate Updated public keys.
 * @returns A new Form updated with the provided public keys.
 */
export function updatePublicKeysInForm(
  form: AnsweredForm,
  encryptionPublicKeysUpdate: EncryptionPublicKeysUpdate
): AnsweredForm {
  return {
    ...form,
    encryption: {
      ...form.encryption,
      publicKeys: {
        ...form.encryption.publicKeys,
        ...encryptionPublicKeysUpdate.publicKeys,
      },
    },
  };
}

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
 * @param forcePrivateAes If `true` forces answers to be encrypted with private AES key. Defaults to `false`.
 * @returns An object containing updated form properties which can be merged with the form object.
 *  If form is already encrypted an empty object is returned.
 * @throws {EncryptionException} if encryption failed.
 */
export async function encryptFormAnswers(
  personalNumber: string,
  form: AnsweredForm,
  forcePrivateAes = false
): Promise<FormAnswersAndEncryption> {
  const isEncrypted = isFormEncrypted(form);

  if (!isEncrypted) {
    const plaintextAnswers = JSON.stringify(form.answers);

    const symmetricKeyName = getSymmetricKeyNameFromForm(form);
    if (symmetricKeyName !== null && !forcePrivateAes) {
      // Method is common symmetric key (i.e. case with co-applicant)
      const symmetricKey = await getSymmetricKeyByForm(form);

      if (symmetricKey === null) {
        throw new EncryptionException(
          "missingSymmetricKey",
          "Symmetric key not found (required for encryption)."
        );
      }

      const encryptedAnswers = await encryptAes(
        plaintextAnswers,
        symmetricKey.toString(16).padStart(64, "0"),
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
 * If the form is already decrypted then the return object contains the original answers and encryption.
 * @throws {EncryptionException} if decryption failed, or no decryption method for the determined encryption
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
          throw new EncryptionException(
            "missingSymmetricKey",
            "Symmetric key not found (required for encryption)."
          );
        }

        const decryptedAnswersRaw = await decryptAes(
          encryptedAnswers,
          symmetricKey.toString(16).padStart(64, "0"),
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
        throw new EncryptionException(
          "invalidEncryptionType",
          `No decryption method implemented for "${encryptionType}"`
        );
      }
    }
  }

  return <FormAnswersAndEncryption>{
    answers: form.answers,
    encryption: form.encryption,
  };
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
 * @returns A tuple containing a status and the updated encryption details.
 */
export async function setupSymmetricKey(
  personalNumber: string,
  form: AnsweredForm
): Promise<SetupSymmetricKeyTuple> {
  const encryptionRelevantPersonalNumbers = Object.keys(
    form.encryption.publicKeys
  );

  const coApplicantPersonalNumber = encryptionRelevantPersonalNumbers.find(
    (pno) => pno !== personalNumber
  );

  const ownKeyPair = await getOrCreateSymmetricKeyPair(personalNumber, form);

  const encryptionPublicKeysUpdate: EncryptionPublicKeysUpdate = {
    publicKeys: {
      [personalNumber]: serializeCryptoNumber(ownKeyPair[0]),
    },
  };

  if (!coApplicantPersonalNumber) {
    return ["missingCoApplicantPersonalNumber", encryptionPublicKeysUpdate];
  }

  const coApplicantPublicKey = getPublicKeyFromForm(
    form,
    coApplicantPersonalNumber
  );

  if (coApplicantPublicKey === null) {
    return ["missingCoApplicantPublicKey", encryptionPublicKeysUpdate];
  }

  const symmetricKeyName = getSymmetricKeyNameFromForm(form);
  await createAndStoreSymmetricKey(
    ownKeyPair[1],
    deserializeCryptoNumber(coApplicantPublicKey),
    deserializeCryptoNumber(form.encryption.primes.P),
    symmetricKeyName
  );

  return ["ready", encryptionPublicKeysUpdate];
}

/**
 * Check that a form uses the correct encryption, or attempt to setup the correct
 * encryption (such as symmetric key encryption) if required.
 * @param personalNumber Personal number of the active user; used for decrypting.
 * @param form Form containing the answers.
 * @returns A tuple containing a status and an updated form object.
 */
export async function updateFormEncryption(
  personalNumber: string,
  form: AnsweredForm
): Promise<UpdateFormEncryptionTuple> {
  const symmetricKeyName = getSymmetricKeyNameFromForm(form);

  if (symmetricKeyName !== null) {
    const currentEncryptionType = form.encryption.type;

    const existingPublicKey = getPublicKeyFromForm(form, personalNumber);

    let encryptionPublicKeyUpdate: EncryptionPublicKeysUpdate = null;

    if (existingPublicKey === null) {
      // Create symmetric key
      try {
        const [encryptionUpdateStatus, encryptionUpdate] =
          await setupSymmetricKey(personalNumber, form);

        encryptionPublicKeyUpdate = encryptionUpdate;

        if (encryptionUpdateStatus !== "ready") {
          throw new EncryptionException(
            encryptionUpdateStatus,
            "Unable to create required symmetric key"
          );
        }
      } catch (error) {
        if (
          (error as EncryptionExceptionInterface)?.status ===
          "missingCoApplicantPublicKey"
        ) {
          // Missing co-applicant public key is a recoverable error - for now return our own public key
          const updatedForm = encryptionPublicKeyUpdate
            ? updatePublicKeysInForm(form, encryptionPublicKeyUpdate)
            : form;
          return ["missingCoApplicantPublicKey", updatedForm];
        }
        throw error;
      }
    }

    if (currentEncryptionType === "privateAesKey") {
      // Re-encrypt answers
      try {
        const decryptedAnswers = await decryptFormAnswers(personalNumber, form);

        const decryptedForm = mergeFormAnswersAndEncryption(
          form,
          decryptedAnswers
        );

        const encryptedAnswers = await encryptFormAnswers(
          personalNumber,
          decryptedForm
        );

        const encryptedForm = mergeFormAnswersAndEncryption(
          decryptedForm,
          encryptedAnswers
        );

        const updatedForm = encryptionPublicKeyUpdate
          ? updatePublicKeysInForm(encryptedForm, encryptionPublicKeyUpdate)
          : encryptedForm;

        updatedForm.encryption.type = "symmetricKey";

        console.log("setupFormEncryption - turned private AES into symmetric");
        return ["ready", updatedForm];
      } catch (error) {
        if (
          (error as EncryptionExceptionInterface)?.status === "missingAesKey"
        ) {
          // We might be the co-applicant so just update with our public key so the main applicant can re-encrypt
          const updatedForm = encryptionPublicKeyUpdate
            ? updatePublicKeysInForm(form, encryptionPublicKeyUpdate)
            : form;
          return ["missingAesKey", updatedForm];
        }
        throw error;
      }
    } else if (encryptionPublicKeyUpdate) {
      // We end up here if for example the form is decrypted (as it's initially when case is notStarted)
      // We still want to send our public key in case it's missing
      const updatedForm = encryptionPublicKeyUpdate
        ? updatePublicKeysInForm(form, encryptionPublicKeyUpdate)
        : form;
      return ["ready", updatedForm];
    }
  }

  return ["ready", form];
}

// #endregion Helpers
