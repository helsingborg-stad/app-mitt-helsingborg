import type {
  Answer,
  AnsweredForm,
  Case,
  EncryptedAnswersWrapper,
  PossiblyEncryptedAnswers,
} from "../../../types/Case";
import type { EncryptionDetails } from "../../../types/Encryption";
import {
  EncryptionErrorStatus,
  EncryptionType,
} from "../../../types/Encryption";
import type { UserInterface } from "../CaseEncryptionHelper";
import {
  answersAreEncrypted,
  getEncryptionFromCase,
  getEncryptionStrategyByType,
  getCurrentForm,
  getEncryptionFromForm,
  getValidEncryptionForForm,
  getEncryptionStrategyFromForm,
  getDataToEncryptFromForm,
  getDataToDecryptFromForm,
  makeFormWithEncryptedData,
  makeFormWithDecryptedData,
  makeCaseWithNewForm,
  getPasswordForForm,
} from "../CaseEncryptionHelper";
import EncryptionException from "../EncryptionException";
import type { ICaseEncryptionService } from "../CaseEncryptionService";
import { CaseEncryptionService } from "../CaseEncryptionService";
import type { PasswordParams } from "../PasswordStrategy";
import { generateRandomPin, PasswordStrategy } from "../PasswordStrategy";
import { to } from "../../../helpers/Misc";
import type {
  EncryptionContext,
  EncryptionStrategyDependencies,
} from "../EncryptionStrategy";

function makeMockCase(
  answers: PossiblyEncryptedAnswers,
  encryption: EncryptionDetails
): Case {
  const partial: Partial<Case> = {
    currentFormId: "a",
    forms: {
      a: {
        currentPosition: {
          index: 0,
          currentMainStep: 0,
          currentMainStepIndex: 0,
          level: 0,
          numberOfMainSteps: 0,
        },
        answers,
        encryption,
      },
    },
  };
  return partial as Case;
}

const CASE_PARAMS_KEY = "__test__key";

const CASE_DECRYPTED = makeMockCase(
  [{ field: { id: "test" }, value: "hello" }],
  { type: EncryptionType.DECRYPTED, symmetricKeyName: CASE_PARAMS_KEY }
);

const CASE_ENCRYPTED = makeMockCase(
  {
    encryptedAnswers:
      "c4588599049e72caa7d87ad66bc180403fe39956eb5b50eb5e2f6fbf57663906bdeb54ddb5598d325d31ee946a0ef403",
  },
  { type: EncryptionType.PASSWORD, symmetricKeyName: CASE_PARAMS_KEY }
);

const CASE_PARAMS: PasswordParams = {
  password: "hello12345",
};

class MockEncryptionDependencies implements EncryptionStrategyDependencies {
  dataMap: Record<string, string> = {};

  async getData(key: string): Promise<string | null> {
    return this.dataMap[key] ?? null;
  }

  async saveData(key: string, value: string): Promise<void> {
    this.dataMap[key] = value;
  }

  set(newData: Record<string, string>) {
    this.dataMap = newData;
  }

  clear() {
    this.dataMap = {};
  }
}

const MOCK_GET_USER = () =>
  Promise.resolve<UserInterface>({ personalNumber: "198602282389" });

function makeEncryptionService(
  dependencies: EncryptionStrategyDependencies
): ICaseEncryptionService {
  return new CaseEncryptionService(dependencies, MOCK_GET_USER);
}

describe("CaseEncryptionService (CaseEncryptionHelper)", () => {
  test("getCurrentForm", () => {
    const form = getCurrentForm(CASE_DECRYPTED);

    expect(form).toEqual(CASE_DECRYPTED.forms[CASE_DECRYPTED.currentFormId]);
  });

  test("answersAreEncrypted", () => {
    const decryptedAnswers = getCurrentForm(CASE_DECRYPTED).answers;
    const encryptedAnswers = getCurrentForm(CASE_ENCRYPTED).answers;

    expect(answersAreEncrypted(decryptedAnswers)).toBe(false);
    expect(answersAreEncrypted(encryptedAnswers)).toBe(true);
  });

  test("getEncryptionFromForm", () => {
    const currentForm = getCurrentForm(CASE_DECRYPTED);

    const encryption = getEncryptionFromForm(currentForm);

    expect(encryption).toEqual(currentForm.encryption);
  });

  test("getEncryptionFromCase", () => {
    const encryption = getEncryptionFromCase(CASE_ENCRYPTED);

    expect(encryption).toEqual(getCurrentForm(CASE_ENCRYPTED).encryption);
  });

  test.each([
    ["null case", () => getEncryptionFromCase(null as unknown as Case)],
    [
      "no form",
      () =>
        getEncryptionFromCase((<Partial<Case>>{
          forms: {},
          currentFormId: "does not exist",
        }) as Case),
    ],
  ])("getEncryptionFromCase throws (%s)", (_, func) => {
    expect(func).toThrow(EncryptionException);
    expect(func).toThrow(
      expect.objectContaining(<Partial<EncryptionException>>{
        status: EncryptionErrorStatus.INVALID_CASE,
      })
    );
  });

  test.each([[EncryptionType.PASSWORD, getCurrentForm(CASE_DECRYPTED)]])(
    "getValidEncryptionForForm (%s)",
    (expectedType, form) => {
      const currentEncryption = getEncryptionFromForm(form);
      const encryption = getValidEncryptionForForm(form);
      const expectedEncryption: EncryptionDetails = {
        ...currentEncryption,
        type: expectedType,
      };

      expect(encryption).toEqual(expectedEncryption);
    }
  );

  test.each([[EncryptionType.PASSWORD, PasswordStrategy]])(
    "getEncryptionStrategyByType (%s)",
    (encryptionType, expectedStrategy) => {
      const strategy = getEncryptionStrategyByType(encryptionType);

      expect(strategy).toEqual(expectedStrategy);
    }
  );

  test("getEncryptionStrategyByType throws (invalid type)", () => {
    const func = () => getEncryptionStrategyByType(EncryptionType.DECRYPTED);

    expect(func).toThrow(EncryptionException);
    expect(func).toThrow(
      expect.objectContaining(<Partial<EncryptionException>>{
        status: EncryptionErrorStatus.INVALID_ENCRYPTION_TYPE,
      })
    );
  });

  test.each([
    ["decrypted", getCurrentForm(CASE_DECRYPTED), PasswordStrategy],
    ["encrypted", getCurrentForm(CASE_ENCRYPTED), PasswordStrategy],
  ])("getEncryptionStrategyFromForm (%s)", (_, form, expectedStrategy) => {
    const strategy = getEncryptionStrategyFromForm(form);

    expect(strategy).toEqual(expectedStrategy);
  });

  test("getDataToEncryptFromForm", () => {
    const form = getCurrentForm(CASE_DECRYPTED);
    const dataToEncrypt = getDataToEncryptFromForm(form);
    const parsed = JSON.parse(dataToEncrypt);

    const expectedData =
      CASE_DECRYPTED.forms[CASE_DECRYPTED.currentFormId].answers;

    expect(parsed).toEqual(expectedData);
  });

  test("getDataToEncryptFromForm throws (encrypted answers)", () => {
    const form = getCurrentForm(CASE_ENCRYPTED);
    const func = () => getDataToEncryptFromForm(form);

    expect(func).toThrow(EncryptionException);
    expect(func).toThrow(
      expect.objectContaining(<Partial<EncryptionException>>{
        status: EncryptionErrorStatus.INVALID_INPUT,
      })
    );
  });

  test("getDataToDecryptFromForm", () => {
    const form = getCurrentForm(CASE_ENCRYPTED);
    const dataToDecrypt = getDataToDecryptFromForm(form);

    const { answers } = CASE_ENCRYPTED.forms[CASE_ENCRYPTED.currentFormId];
    const expectedData = (answers as EncryptedAnswersWrapper).encryptedAnswers;

    expect(dataToDecrypt).toEqual(expectedData);
  });

  test("getDataToDecryptFromForm throws (decrypted answers)", () => {
    const form = getCurrentForm(CASE_DECRYPTED);
    const func = () => getDataToDecryptFromForm(form);

    expect(func).toThrow(EncryptionException);
    expect(func).toThrow(
      expect.objectContaining(<Partial<EncryptionException>>{
        status: EncryptionErrorStatus.INVALID_INPUT,
      })
    );
  });

  test("makeFormWithEncryptedData", () => {
    const form = getCurrentForm(CASE_DECRYPTED);
    const mockEncryptedData = "this is encrypted data";

    const newForm = makeFormWithEncryptedData(form, mockEncryptedData, {
      type: EncryptionType.PASSWORD,
    });

    const { answers } = newForm;
    const expectedData = (answers as EncryptedAnswersWrapper).encryptedAnswers;

    expect(answersAreEncrypted(answers)).toBe(true);
    expect(expectedData).toBe(mockEncryptedData);
  });

  test("makeFormWithDecryptedData", () => {
    const form = getCurrentForm(CASE_DECRYPTED);
    const mockAnswers: Answer[] = [
      { field: { id: "test" }, value: "test value" },
    ];
    const mockDecryptedData = JSON.stringify(mockAnswers);
    const newForm = makeFormWithDecryptedData(form, mockDecryptedData);

    const { answers } = newForm;

    expect(answersAreEncrypted(answers)).toBe(false);
    expect(answers).toEqual(mockAnswers);
  });

  test("makeFormWithDecryptedData throws", () => {
    const form = getCurrentForm(CASE_DECRYPTED);
    const invalidAnswers = "not valid";
    const mockDecryptedData = JSON.stringify(invalidAnswers);

    const func = () => {
      makeFormWithDecryptedData(form, mockDecryptedData);
    };

    expect(func).toThrow(EncryptionException);
    expect(func).toThrow(
      expect.objectContaining(<Partial<EncryptionException>>{
        status: EncryptionErrorStatus.INVALID_INPUT,
      })
    );
  });

  test("makeCaseWithNewForm", () => {
    const mockForm: AnsweredForm = (<Partial<AnsweredForm>>{
      encryption: { type: EncryptionType.PASSWORD, symmetricKeyName: "hello" },
      answers: { encryptedAnswers: "lorem ipsum dolar sitem" },
    }) as AnsweredForm;

    const newCase = makeCaseWithNewForm(CASE_DECRYPTED, mockForm);

    expect(getCurrentForm(newCase)).toEqual(mockForm);
  });

  test("getPasswordForForm", async () => {
    const form = getCurrentForm(CASE_DECRYPTED);
    const user = await MOCK_GET_USER();
    const dependencies = new MockEncryptionDependencies();

    const firstTry = await getPasswordForForm(form, user, dependencies);
    const generatedPassword =
      await PasswordStrategy.generateAndSaveBasicPinPassword(
        { encryptionDetails: form.encryption, user },
        dependencies
      );
    const secondTry = await getPasswordForForm(form, user, dependencies);

    expect(firstTry).toBeNull();
    expect(secondTry).toBe(generatedPassword);
  });
});

describe("CaseEncryptionService", () => {
  test.each([[CASE_DECRYPTED]])(
    "ignores already decrypted case",
    async (caseData: Case) => {
      const encryptionService = makeEncryptionService(
        new MockEncryptionDependencies()
      );

      const newCase = await encryptionService.decrypt(caseData);

      expect(newCase).toEqual(caseData);
    }
  );

  test.each([
    [
      EncryptionType.PASSWORD,
      CASE_DECRYPTED,
      {
        [CASE_PARAMS_KEY]: JSON.stringify(CASE_PARAMS),
      },
    ],
  ])(
    "uses the correct encryption type (%s)",
    async (
      expectedType: EncryptionType,
      caseData: Case,
      mockStorageData: Record<string, string>
    ) => {
      const mockDependencies = new MockEncryptionDependencies();
      mockDependencies.set(mockStorageData);
      const encryptionService = makeEncryptionService(mockDependencies);

      const newCase = await encryptionService.encrypt(caseData);
      const newEncryption = getEncryptionFromCase(newCase);

      expect(newEncryption?.type).toBe(expectedType);
    }
  );

  test.each([
    [
      CASE_DECRYPTED,
      CASE_ENCRYPTED,
      {
        [CASE_PARAMS_KEY]: JSON.stringify(CASE_PARAMS),
      },
    ],
  ])(
    "encrypts",
    async (
      caseData: Case,
      expectedCaseData: Case,
      mockStorageData: Record<string, string>
    ) => {
      const mockDependencies = new MockEncryptionDependencies();
      mockDependencies.set(mockStorageData);
      const encryptionService = makeEncryptionService(mockDependencies);

      const newCase = await encryptionService.encrypt(caseData);

      expect(newCase).toEqual(expectedCaseData);
    }
  );

  test.each([
    [
      CASE_ENCRYPTED,
      CASE_DECRYPTED,
      {
        [CASE_PARAMS_KEY]: JSON.stringify(CASE_PARAMS),
      },
    ],
  ])(
    "decrypts",
    async (
      caseData: Case,
      expectedCaseData: Case,
      mockStorageData: Record<string, string>
    ) => {
      const mockDependencies = new MockEncryptionDependencies();
      mockDependencies.set(mockStorageData);
      const encryptionService = makeEncryptionService(mockDependencies);

      const newCase = await encryptionService.decrypt(caseData);

      expect(newCase).toEqual(expectedCaseData);
    }
  );

  test.each([
    [
      getCurrentForm(CASE_DECRYPTED),
      getCurrentForm(CASE_ENCRYPTED),
      {
        [CASE_PARAMS_KEY]: JSON.stringify(CASE_PARAMS),
      },
    ],
  ])(
    "encrypts form",
    async (
      form: AnsweredForm,
      expectedForm: AnsweredForm,
      mockStorageData: Record<string, string>
    ) => {
      const mockDependencies = new MockEncryptionDependencies();
      mockDependencies.set(mockStorageData);
      const encryptionService = makeEncryptionService(mockDependencies);

      const newForm = await encryptionService.encryptForm(form);

      expect(newForm).toEqual(expectedForm);
    }
  );

  test.each([
    [
      getCurrentForm(CASE_ENCRYPTED),
      getCurrentForm(CASE_DECRYPTED),
      {
        [CASE_PARAMS_KEY]: JSON.stringify(CASE_PARAMS),
      },
    ],
  ])(
    "decrypts form",
    async (
      form: AnsweredForm,
      expectedForm: AnsweredForm,
      mockStorageData: Record<string, string>
    ) => {
      const mockDependencies = new MockEncryptionDependencies();
      mockDependencies.set(mockStorageData);
      const encryptionService = makeEncryptionService(mockDependencies);

      const newForm = await encryptionService.decryptForm(form);

      expect(newForm).toEqual(expectedForm);
    }
  );
});

describe("CaseEncryptionService (Password specific)", () => {
  it("throws REQUIRES_PARAMS when missing password (encrypt)", async () => {
    const encryptionService = makeEncryptionService(
      new MockEncryptionDependencies()
    );

    const func = async () => {
      await encryptionService.encrypt(CASE_DECRYPTED);
    };

    await expect(func).rejects.toThrow(EncryptionException);
    await expect(func).rejects.toThrow(
      expect.objectContaining(<Partial<EncryptionException>>{
        status: EncryptionErrorStatus.REQUIRES_PARAMS,
      })
    );
  });

  it("throws REQUIRES_PARAMS when missing password (decrypt)", async () => {
    const encryptionService = makeEncryptionService(
      new MockEncryptionDependencies()
    );

    const func = async () => {
      await encryptionService.decrypt(CASE_ENCRYPTED);
    };

    await expect(func).rejects.toThrow(EncryptionException);
    await expect(func).rejects.toThrow(
      expect.objectContaining(<Partial<EncryptionException>>{
        status: EncryptionErrorStatus.REQUIRES_PARAMS,
      })
    );
  });

  it("generates a 4-digit pin code", async () => {
    const pins = await Promise.all(
      Array(100)
        .fill(0)
        .map(() => generateRandomPin())
    );

    expect(pins).toEqual(
      expect.arrayContaining([expect.stringMatching(/^\d{4}$/)])
    );
  });

  it("generates and saves a password", async () => {
    const saveFunc = jest.fn();
    const mockDependencies: EncryptionStrategyDependencies = {
      async getData(_): Promise<string | null> {
        return null;
      },
      saveData: saveFunc,
    };

    const password = await PasswordStrategy.generateAndSaveBasicPinPassword(
      {
        encryptionDetails: getEncryptionFromCase(CASE_DECRYPTED),
      },
      mockDependencies
    );

    expect(typeof password).toBe("string");
    expect(password.length).toBeGreaterThan(0);
    expect(saveFunc).toHaveBeenCalledWith(
      CASE_PARAMS_KEY,
      expect.stringContaining(password)
    );
  });

  it("encrypts after generating a password", async () => {
    const mockDependencies = new MockEncryptionDependencies();
    const encryptionService = makeEncryptionService(mockDependencies);

    await PasswordStrategy.generateAndSaveBasicPinPassword(
      {
        encryptionDetails: getEncryptionFromCase(CASE_DECRYPTED),
      },
      mockDependencies
    );
    const newCase = await encryptionService.encrypt(CASE_DECRYPTED);
    const { answers, encryption } = getCurrentForm(newCase);

    expect(answersAreEncrypted(answers)).toBe(true);
    expect(encryption.type).toBe(EncryptionType.PASSWORD);
  });

  it("can retrieve existing password", async () => {
    const mockDependencies = new MockEncryptionDependencies();
    const context: EncryptionContext = {
      encryptionDetails: getEncryptionFromCase(CASE_DECRYPTED),
    };

    const firstPassword = await PasswordStrategy.getPassword(
      context,
      mockDependencies
    );
    await PasswordStrategy.generateAndSaveBasicPinPassword(
      context,
      mockDependencies
    );
    const secondPassword = await PasswordStrategy.getPassword(
      context,
      mockDependencies
    );

    expect(firstPassword).toBeNull();
    expect(secondPassword).not.toBeNull();
  });

  it("can check if password exists", async () => {
    const mockDependencies = new MockEncryptionDependencies();
    const context: EncryptionContext = {
      encryptionDetails: getEncryptionFromCase(CASE_DECRYPTED),
    };

    const firstCheck = await PasswordStrategy.hasPassword(
      context,
      mockDependencies
    );
    await PasswordStrategy.generateAndSaveBasicPinPassword(
      context,
      mockDependencies
    );
    const secondCheck = await PasswordStrategy.hasPassword(
      context,
      mockDependencies
    );

    expect(firstCheck).toBe(false);
    expect(secondCheck).toBe(true);
  });

  it("can provide a password to use", async () => {
    const mockDependencies = new MockEncryptionDependencies();
    const context: EncryptionContext = {
      encryptionDetails: getEncryptionFromCase(CASE_DECRYPTED),
    };

    const testPassword = "test password";

    await PasswordStrategy.providePassword(
      testPassword,
      context,
      mockDependencies
    );
    const password = await PasswordStrategy.getPassword(
      context,
      mockDependencies
    );

    expect(password).toBe(testPassword);
  });
});

describe("CaseEncryptionService (simulated scenarios)", () => {
  test("partner resets app", async () => {
    const mockdependencies = new MockEncryptionDependencies();
    await mockdependencies.saveData(
      CASE_PARAMS_KEY,
      JSON.stringify(CASE_PARAMS)
    );
    const encryptionService = makeEncryptionService(mockdependencies);
    const firstDecrypt = await encryptionService.decrypt(CASE_ENCRYPTED);

    mockdependencies.clear();

    const [decryptError] = await to(encryptionService.decrypt(CASE_ENCRYPTED));

    await mockdependencies.saveData(
      CASE_PARAMS_KEY,
      JSON.stringify(CASE_PARAMS)
    );
    const secondDecrypt = await encryptionService.decrypt(CASE_ENCRYPTED);

    expect(firstDecrypt).toEqual(secondDecrypt);
    expect(decryptError).toBeDefined();
    expect(decryptError).toBeInstanceOf(EncryptionException);
    expect((decryptError as EncryptionException).status).toBe(
      EncryptionErrorStatus.REQUIRES_PARAMS
    );
  });
});
