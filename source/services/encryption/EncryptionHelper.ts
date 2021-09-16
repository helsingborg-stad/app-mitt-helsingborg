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

export function getSymmetricKeyNameFromForm(form: AnsweredForm): string | null {
  return form.encryption.symmetricKeyName ?? null;
}

export function getSymmetricKeyStoreKeyByForm(form: AnsweredForm): string {
  const symmetricKeyName = getSymmetricKeyNameFromForm(form);
  return getSymmetricKeyStoreKey(symmetricKeyName);
}

export async function getSymmetricKeyByForm(
  form: AnsweredForm
): Promise<CryptoNumber> {
  const symmetricKeyName = getSymmetricKeyNameFromForm(form);

  if (symmetricKeyName === null) {
    return null;
  }

  return getSymmetricKey(symmetricKeyName);
}

export function getPublicKeyFromForm(
  form: AnsweredForm,
  personalNumber: string
): SerializedCryptoNumber | null {
  return form.encryption.publicKeys[personalNumber] ?? null;
}

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

export function isFormEncrypted(form: AnsweredForm): boolean {
  return !Array.isArray(form.answers);
}

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

export async function updateFormEncryption(
  personalNumber: string,
  form: AnsweredForm
): Promise<UpdateFormEncryptionTuple> {
  const symmetricKeyName = getSymmetricKeyNameFromForm(form);

  if (symmetricKeyName !== null) {
    const currentEncryptionType = form.encryption.type;

    const existingPublicKey = getPublicKeyFromForm(form, personalNumber);
    const existingSymmetricKey = await getSymmetricKeyByForm(form);

    let encryptionPublicKeyUpdate: EncryptionPublicKeysUpdate = null;

    if (existingPublicKey === null || existingSymmetricKey === null) {
      // Create symmetric key
      try {
        const [
          encryptionUpdateStatus,
          encryptionUpdate,
        ] = await setupSymmetricKey(personalNumber, form);

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
        const errorStatus = (error as EncryptionExceptionInterface)?.status;
        if (
          errorStatus === "missingAesKey" ||
          errorStatus === "missingSymmetricKey"
        ) {
          // For "missingAesKey" - We might be the co-applicant so just update
          // with our public key so the main applicant can re-encrypt
          const updatedForm = encryptionPublicKeyUpdate
            ? updatePublicKeysInForm(form, encryptionPublicKeyUpdate)
            : form;
          return [errorStatus, updatedForm];
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
