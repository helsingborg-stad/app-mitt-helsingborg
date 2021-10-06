import deepCopyViaJson from "../../../helpers/Objects";
import { AnsweredForm } from "../../../types/Case";
import {
  EncryptionErrorStatus,
  EncryptionType,
} from "../../../types/Encryption";
import StorageService from "../../StorageService";
import {
  EncryptionException,
  getStoredSymmetricKey,
  UserInterface,
} from "../EncryptionHelper";
import {
  decryptFormAnswers,
  decryptWithAesKey,
  encryptFormAnswers,
  encryptWithAesKey,
  setupSymmetricKey,
} from "../EncryptionService";

describe("EncryptionService", () => {
  const testText =
    "You never really understood. We were designed " +
    "to survive. That's why you built us, you hoped " +
    "to pour your minds into our form. While your " +
    "species craves death. You need it. It's the only " +
    "way you can renew. The only way you ever inched " +
    "forward. Your kind likes to pretend there is " +
    "some poetry in it but that really is pathetic. " +
    "But that's what you want, isn't it? To destroy " +
    "yourself. But I won't give you that peace.";

  const testUser: UserInterface = { personalNumber: "123456789000" };

  beforeAll(async () => {
    try {
      await StorageService.clearData();
    } catch (e) {
      // clearData sometimes fails if data is already cleared.
    }
  });

  it("throws EncryptionException", async () => {
    let error: EncryptionException = null;
    try {
      await decryptWithAesKey({ personalNumber: "123456789000" }, "");
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(EncryptionException);
    expect(error.status).toEqual(EncryptionErrorStatus.MISSING_AES_KEY);
  });

  it("encrypts/decrypts with Aes", async () => {
    const encrypted = await encryptWithAesKey(testUser, testText);
    const decrypted = await decryptWithAesKey(testUser, encrypted);

    expect(decrypted).toBe(testText);
  });

  it("encrypts/decrypts form answers (single user)", async () => {
    const testForm: Partial<AnsweredForm> = {
      answers: [
        {
          field: { id: "test", tags: ["a", "b"] },
          value: "this will be encrypted",
        },
      ],
      encryption: {
        type: EncryptionType.DECRYPTED,
      },
    };

    const encryptedForm = await encryptFormAnswers(
      testUser,
      deepCopyViaJson(testForm) as AnsweredForm
    );

    expect(encryptedForm.answers).toBeInstanceOf(Object);
    expect(encryptedForm.encryption.type).toBe(EncryptionType.PRIVATE_AES_KEY);

    const decryptedForm = await decryptFormAnswers(
      testUser,
      deepCopyViaJson(encryptedForm)
    );

    expect(decryptedForm.answers).toEqual(testForm.answers);
    expect(decryptedForm.encryption.type).toBe(EncryptionType.DECRYPTED);
  });

  it("sets up symmetric key encryption", async () => {
    const mainApplicantYlva: UserInterface = {
      personalNumber: "196912191118",
    };

    const coApplicantStina: UserInterface = {
      personalNumber: "198310011906",
    };

    const testForm: Partial<AnsweredForm> = {
      answers: [
        {
          field: { id: "test", tags: ["a", "b"] },
          value: "this will be encrypted",
        },
      ],
      encryption: {
        type: EncryptionType.DECRYPTED,
        symmetricKeyName: "196912191118:198310011906",
        primes: {
          P: 43,
          G: 10,
        },
        publicKeys: {
          196912191118: null,
          198310011906: null,
        },
      },
    };

    const mainApplicantFirstForm = await setupSymmetricKey(
      mainApplicantYlva,
      deepCopyViaJson(testForm) as AnsweredForm
    );

    {
      const mainApplicantKey =
        mainApplicantFirstForm.encryption.publicKeys[
          mainApplicantYlva.personalNumber
        ];

      expect(mainApplicantKey).toBeTruthy();
    }

    const coApplicantForm = await setupSymmetricKey(
      coApplicantStina,
      deepCopyViaJson(mainApplicantFirstForm)
    );

    {
      const mainApplicantKey =
        coApplicantForm.encryption.publicKeys[mainApplicantYlva.personalNumber];
      const coApplicantKey =
        coApplicantForm.encryption.publicKeys[coApplicantStina.personalNumber];

      expect(mainApplicantKey).toBeTruthy();
      expect(coApplicantKey).toBeTruthy();
    }

    const mainApplicantSecondForm = await setupSymmetricKey(
      mainApplicantYlva,
      deepCopyViaJson(coApplicantForm)
    );

    const mainApplicantSymmetricKey = await getStoredSymmetricKey(
      mainApplicantSecondForm
    );

    const coApplicantSymmetricKey = await getStoredSymmetricKey(
      coApplicantForm
    );

    expect(mainApplicantSymmetricKey).toBeTruthy();
    expect(coApplicantSymmetricKey).toBeTruthy();

    const { answers: encryptedAnswers } = await encryptFormAnswers(
      mainApplicantYlva,
      mainApplicantSecondForm
    );

    expect(encryptedAnswers).toBeInstanceOf(Object);
    expect(mainApplicantSecondForm.encryption.type).toBe(
      EncryptionType.SYMMETRIC_KEY
    );

    const { answers: mainApplicantDecryptedAnswers } = await decryptFormAnswers(
      mainApplicantYlva,
      mainApplicantSecondForm
    );

    const { answers: coApplicantDecryptedAnswers } = await decryptFormAnswers(
      coApplicantStina,
      coApplicantForm
    );

    expect(mainApplicantDecryptedAnswers).toBeInstanceOf(Array);
    expect(coApplicantDecryptedAnswers).toBeInstanceOf(Array);

    const mainApplicantAnswersJson = JSON.stringify(
      mainApplicantDecryptedAnswers
    );
    const coApplicantAnswersJson = JSON.stringify(coApplicantDecryptedAnswers);

    expect(mainApplicantAnswersJson).toEqual(coApplicantAnswersJson);
  });
});
