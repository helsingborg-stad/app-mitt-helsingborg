import {
  FormAnswersAndEncryption,
  mergeFormAnswersAndEncryption,
} from "../source/services/encryption/EncryptionHelper";
import StorageService from "../source/services/StorageService";
import { AnsweredForm } from "../source/types/Case";

describe("Encryption", () => {
  beforeAll(async () => {
    try {
      await StorageService.clearData();
    } catch (e) {
      // clearData sometimes fails if data is already cleared.
    }
  });

  it("should merge form and answers + encryption", () => {
    const mockForm: Partial<AnsweredForm> = {
      currentPosition: {
        currentMainStep: 1,
        currentMainStepIndex: 2,
        index: 3,
        level: 4,
      },
      answers: [
        { field: { id: "test" }, value: "hello" },
        { field: { id: "test2", tags: ["a", "b"] }, value: "world" },
      ],
      encryption: {
        type: "decrypted",
      },
    };

    const mockAnswersAndEncryption: FormAnswersAndEncryption = {
      answers: { encryptedAnswers: "encrypted_answers_string" },
      encryption: {
        type: "privateAesKey",
      },
    };

    const merged = mergeFormAnswersAndEncryption(
      mockForm as AnsweredForm,
      mockAnswersAndEncryption
    );
    expect(merged).not.toBe(mockForm);
    expect(Array.isArray(merged.answers)).toBe(false);
    expect(merged.encryption.type).toBe("privateAesKey");
    expect(merged.currentPosition).toBeDefined();
  });
});
