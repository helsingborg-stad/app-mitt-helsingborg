import { NativeModules } from "react-native";
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

  const testPassword = "561b4c1fe4a11e72e73dff67e14de074";

  const testEncryptedText =
    "ca3cbbf71778df9851d9510f224703e8" +
    "894fe27be61f390fb413f6a006d1f515" +
    "d613c0bc39b2043e0c6179cb98adf601" +
    "3dd3105041a99295b2b488b20e1d20ab" +
    "afbd5082c04f8ff47445fd6f57d77bcc" +
    "fd8639b8296e6859b5ed5fc92b6b73c9" +
    "c2c8815098c53fbfab3762f785f47528" +
    "90b77f6577e014a2ef1d73d9834d1c8e" +
    "06034df07531818913e5db78a25926b6" +
    "3680b51d5e7145bbd239ef2c82d96568" +
    "3943fefaed512e88d8454e3c059e98a2" +
    "039d729d16fb7c4d85a7f08e5f13d642" +
    "e99b9e8331cfb5095d2702773aaa2c3e" +
    "0647f3309bd58bc1841048331d83398c" +
    "75d47f73f9c90e1b542352df63662a90" +
    "27cf93ae5f043fd4152a043da306513f" +
    "a01be5170d05dd5abc1b4442a054ae60" +
    "52d9b6acb1b89e97c66a20c1d9500545" +
    "8a7b425eb095f4418f64e4ed2c4e96dc" +
    "3e57c99823f12f41ab2335164a4748aa" +
    "c70c47c400c8d68fa4584dc0876958a7" +
    "e2d2328cbafe30a1419076b8cedd488c" +
    "6f8f8968d35c93c9a5d353eec4e613c5" +
    "0d1405225f751c66e02fda9b5dcd0825" +
    "97706edae83c5339448e35e0a642cf2f" +
    "ef17d733d91f4e686d579dcc6d4a933f" +
    "59d0a6200e912178b82e87881db2842b";

  const testUser: UserInterface = { personalNumber: "123456789000" };

  beforeEach(async () => {
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
