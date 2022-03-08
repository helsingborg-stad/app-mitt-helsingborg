import {
  Answer,
  AnsweredForm,
  Case,
  EncryptedAnswersWrapper,
  PossiblyEncryptedAnswers,
} from "../../../types/Case";
import {
  EncryptionDetails,
  EncryptionErrorStatus,
  EncryptionType,
} from "../../../types/Encryption";
import {
  answersAreEncrypted,
  getEncryptionFromCase,
  getEncryptionStrategyByType,
  EncryptionException,
  UserInterface,
  getCurrentForm,
  getEncryptionFromForm,
  getValidEncryptionForForm,
  getEncryptionStrategyFromForm,
  getDataToEncryptFromForm,
  getDataToDecryptFromForm,
  makeFormWithEncryptedData,
  makeFormWithDecryptedData,
  makeCaseWithNewForm,
} from "../CaseEncryptionHelper";
import {
  DeviceLocalAESParams,
  DeviceLocalAESStrategy,
} from "../DeviceLocalAESStrategy";
import {
  CaseEncryptionService,
  ICaseEncryptionService,
  IStorage,
} from "../CaseEncryptionService";
import {
  generateRandomPin,
  PasswordParams,
  PasswordStrategy,
} from "../PasswordStrategy";
import { to } from "../../../helpers/Misc";
import {
  EncryptionContext,
  EncryptionDependencies,
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
        },
        answers,
        encryption,
      },
    },
  };
  return partial as Case;
}

const CASE_DECRYPTED_SOLO = makeMockCase(
  [{ field: { id: "test" }, value: "hello" }],
  { type: EncryptionType.DECRYPTED }
);

const CASE_ENCRYPTED_SOLO = makeMockCase(
  {
    encryptedAnswers:
      "4a9d9fa7f96c39f7777aace0c487131fcd25abfd836f108f5e1539bb6cf6927e57c8022e70cb8c3b43ade413f90b1eb2",
  },
  { type: EncryptionType.PRIVATE_AES_KEY }
);

const CASE_PARAMS_KEY_SOLO = "198602282389DeviceLocalKey";

const CASE_PARAMS_SOLO: DeviceLocalAESParams = {
  key: "eba252021f5c4c4e1761b88af2668cd5e0a4961ce03b66701d0823012ede269a",
  iv: "61d33a398cdcbba45f479d01950974bc",
};

const CASE_PARAMS_KEY_PARTNER = "symmetricTest";

const CASE_PARAMS_PARTNER: PasswordParams = {
  password: "hello12345",
};

const CASE_DECRYPTED_PARTNER = makeMockCase(
  [{ field: { id: "test" }, value: "hello" }],
  { type: EncryptionType.DECRYPTED, symmetricKeyName: CASE_PARAMS_KEY_PARTNER }
);

const CASE_ENCRYPTED_PARTNER = makeMockCase(
  {
    encryptedAnswers:
      "c4588599049e72caa7d87ad66bc180403fe39956eb5b50eb5e2f6fbf57663906bdeb54ddb5598d325d31ee946a0ef403",
  },
  { type: EncryptionType.PASSWORD, symmetricKeyName: CASE_PARAMS_KEY_PARTNER }
);

class MockStorage implements IStorage {
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

function makeEncryptionService(storage: IStorage): ICaseEncryptionService {
  return new CaseEncryptionService(storage, MOCK_GET_USER);
}

describe("CaseEncryptionService (CaseEncryptionHelper)", () => {
  test("getCurrentForm", () => {
    const form = getCurrentForm(CASE_DECRYPTED_SOLO);

    expect(form).toEqual(
      CASE_DECRYPTED_SOLO.forms[CASE_DECRYPTED_SOLO.currentFormId]
    );
  });

  test("answersAreEncrypted", () => {
    const decryptedAnswers = getCurrentForm(CASE_DECRYPTED_SOLO).answers;
    const encryptedAnswers = getCurrentForm(CASE_ENCRYPTED_SOLO).answers;

    expect(answersAreEncrypted(decryptedAnswers)).toBe(false);
    expect(answersAreEncrypted(encryptedAnswers)).toBe(true);
  });

  test("getEncryptionFromForm", () => {
    const currentForm = getCurrentForm(CASE_DECRYPTED_SOLO);

    const encryption = getEncryptionFromForm(currentForm);

    expect(encryption).toEqual(currentForm.encryption);
  });

  test("getEncryptionFromCase", () => {
    const encryption = getEncryptionFromCase(CASE_ENCRYPTED_SOLO);

    expect(encryption).toEqual(getCurrentForm(CASE_ENCRYPTED_SOLO).encryption);
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

  test.each([
    [
      "solo ->",
      EncryptionType.PRIVATE_AES_KEY,
      getCurrentForm(CASE_DECRYPTED_SOLO),
    ],
    [
      "partner ->",
      EncryptionType.PASSWORD,
      getCurrentForm(CASE_DECRYPTED_PARTNER),
    ],
  ])("getValidEncryptionForForm (%s %s)", (_, expectedType, form) => {
    const currentEncryption = getEncryptionFromForm(form);
    const encryption = getValidEncryptionForForm(form);
    const expectedEncryption: EncryptionDetails = {
      ...currentEncryption,
      type: expectedType,
    };

    expect(encryption).toEqual(expectedEncryption);
  });

  test.each([
    [EncryptionType.PRIVATE_AES_KEY, DeviceLocalAESStrategy],
    [EncryptionType.PASSWORD, PasswordStrategy],
  ])("getEncryptionStrategyByType (%s)", (encryptionType, expectedStrategy) => {
    const strategy = getEncryptionStrategyByType(encryptionType);

    expect(strategy).toEqual(expectedStrategy);
  });

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
    [
      "solo/decrypted",
      getCurrentForm(CASE_DECRYPTED_SOLO),
      DeviceLocalAESStrategy,
    ],
    [
      "solo/encrypted",
      getCurrentForm(CASE_ENCRYPTED_SOLO),
      DeviceLocalAESStrategy,
    ],
    [
      "partner/decrypted",
      getCurrentForm(CASE_DECRYPTED_PARTNER),
      PasswordStrategy,
    ],
    [
      "partner/encrypted",
      getCurrentForm(CASE_ENCRYPTED_PARTNER),
      PasswordStrategy,
    ],
  ])("getEncryptionStrategyFromForm (%s)", (_, form, expectedStrategy) => {
    const strategy = getEncryptionStrategyFromForm(form);

    expect(strategy).toEqual(expectedStrategy);
  });

  test("getDataToEncryptFromForm", () => {
    const form = getCurrentForm(CASE_DECRYPTED_SOLO);
    const dataToEncrypt = getDataToEncryptFromForm(form);
    const parsed = JSON.parse(dataToEncrypt);

    const expectedData =
      CASE_DECRYPTED_SOLO.forms[CASE_DECRYPTED_SOLO.currentFormId].answers;

    expect(parsed).toEqual(expectedData);
  });

  test("getDataToEncryptFromForm throws (encrypted answers)", () => {
    const form = getCurrentForm(CASE_ENCRYPTED_SOLO);
    const func = () => getDataToEncryptFromForm(form);

    expect(func).toThrow(EncryptionException);
    expect(func).toThrow(
      expect.objectContaining(<Partial<EncryptionException>>{
        status: EncryptionErrorStatus.INVALID_INPUT,
      })
    );
  });

  test("getDataToDecryptFromForm", () => {
    const form = getCurrentForm(CASE_ENCRYPTED_SOLO);
    const dataToDecrypt = getDataToDecryptFromForm(form);

    const { answers } =
      CASE_ENCRYPTED_SOLO.forms[CASE_ENCRYPTED_SOLO.currentFormId];
    const expectedData = (answers as EncryptedAnswersWrapper).encryptedAnswers;

    expect(dataToDecrypt).toEqual(expectedData);
  });

  test("getDataToDecryptFromForm throws (decrypted answers)", () => {
    const form = getCurrentForm(CASE_DECRYPTED_SOLO);
    const func = () => getDataToDecryptFromForm(form);

    expect(func).toThrow(EncryptionException);
    expect(func).toThrow(
      expect.objectContaining(<Partial<EncryptionException>>{
        status: EncryptionErrorStatus.INVALID_INPUT,
      })
    );
  });

  test("makeFormWithEncryptedData", () => {
    const form = getCurrentForm(CASE_DECRYPTED_SOLO);
    const mockEncryptedData = "this is encrypted data";

    const newForm = makeFormWithEncryptedData(form, mockEncryptedData, {
      type: EncryptionType.PRIVATE_AES_KEY,
    });

    const { answers } = newForm;
    const expectedData = (answers as EncryptedAnswersWrapper).encryptedAnswers;

    expect(answersAreEncrypted(answers)).toBe(true);
    expect(expectedData).toBe(mockEncryptedData);
  });

  test("makeFormWithDecryptedData", () => {
    const form = getCurrentForm(CASE_DECRYPTED_SOLO);
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
    const form = getCurrentForm(CASE_DECRYPTED_SOLO);
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

    const newCase = makeCaseWithNewForm(CASE_DECRYPTED_SOLO, mockForm);

    expect(getCurrentForm(newCase)).toEqual(mockForm);
  });
});

describe("CaseEncryptionService", () => {
  test.each([
    ["solo", CASE_DECRYPTED_SOLO],
    ["partner", CASE_DECRYPTED_PARTNER],
  ])("ignores already decrypted case (%s)", async (_, caseData: Case) => {
    const encryptionService = makeEncryptionService(new MockStorage());

    const newCase = await encryptionService.decrypt(caseData);

    expect(newCase).toEqual(caseData);
  });

  test.each([
    ["solo ->", EncryptionType.PRIVATE_AES_KEY, CASE_DECRYPTED_SOLO, {}],
    [
      "partner ->",
      EncryptionType.PASSWORD,
      CASE_DECRYPTED_PARTNER,
      {
        [CASE_PARAMS_KEY_PARTNER]: JSON.stringify(CASE_PARAMS_PARTNER),
      },
    ],
  ])(
    "uses the correct encryption type (%s %s)",
    async (
      _,
      expectedType: EncryptionType,
      caseData: Case,
      mockStorageData: Record<string, string>
    ) => {
      const mockStorage = new MockStorage();
      mockStorage.set(mockStorageData);
      const encryptionService = makeEncryptionService(mockStorage);

      const newCase = await encryptionService.encrypt(caseData);
      const newEncryption = getEncryptionFromCase(newCase);

      expect(newEncryption?.type).toBe(expectedType);
    }
  );

  test.each([
    [
      "solo (DeviceLocalAES)",
      CASE_DECRYPTED_SOLO,
      CASE_ENCRYPTED_SOLO,
      {
        [CASE_PARAMS_KEY_SOLO]: JSON.stringify(CASE_PARAMS_SOLO),
      },
    ],
    [
      "partner (Password)",
      CASE_DECRYPTED_PARTNER,
      CASE_ENCRYPTED_PARTNER,
      {
        [CASE_PARAMS_KEY_PARTNER]: JSON.stringify(CASE_PARAMS_PARTNER),
      },
    ],
  ])(
    "encrypts %s",
    async (
      _,
      caseData: Case,
      expectedCaseData: Case,
      mockStorageData: Record<string, string>
    ) => {
      const mockStorage = new MockStorage();
      mockStorage.set(mockStorageData);
      const encryptionService = makeEncryptionService(mockStorage);

      const newCase = await encryptionService.encrypt(caseData);

      expect(newCase).toEqual(expectedCaseData);
    }
  );

  test.each([
    [
      "solo (DeviceLocalAES)",
      CASE_ENCRYPTED_SOLO,
      CASE_DECRYPTED_SOLO,
      {
        [CASE_PARAMS_KEY_SOLO]: JSON.stringify(CASE_PARAMS_SOLO),
      },
    ],
    [
      "partner (Password)",
      CASE_ENCRYPTED_PARTNER,
      CASE_DECRYPTED_PARTNER,
      {
        [CASE_PARAMS_KEY_PARTNER]: JSON.stringify(CASE_PARAMS_PARTNER),
      },
    ],
  ])(
    "decrypts %s",
    async (
      _,
      caseData: Case,
      expectedCaseData: Case,
      mockStorageData: Record<string, string>
    ) => {
      const mockStorage = new MockStorage();
      mockStorage.set(mockStorageData);
      const encryptionService = makeEncryptionService(mockStorage);

      const newCase = await encryptionService.decrypt(caseData);

      expect(newCase).toEqual(expectedCaseData);
    }
  );

  test.each([
    [
      "solo (DeviceLocalAES)",
      getCurrentForm(CASE_DECRYPTED_SOLO),
      getCurrentForm(CASE_ENCRYPTED_SOLO),
      {
        [CASE_PARAMS_KEY_SOLO]: JSON.stringify(CASE_PARAMS_SOLO),
      },
    ],
    [
      "partner (Password)",
      getCurrentForm(CASE_DECRYPTED_PARTNER),
      getCurrentForm(CASE_ENCRYPTED_PARTNER),
      {
        [CASE_PARAMS_KEY_PARTNER]: JSON.stringify(CASE_PARAMS_PARTNER),
      },
    ],
  ])(
    "encrypts form %s",
    async (
      _,
      form: AnsweredForm,
      expectedForm: AnsweredForm,
      mockStorageData: Record<string, string>
    ) => {
      const mockStorage = new MockStorage();
      mockStorage.set(mockStorageData);
      const encryptionService = makeEncryptionService(mockStorage);

      const newForm = await encryptionService.encryptForm(form);

      expect(newForm).toEqual(expectedForm);
    }
  );

  test.each([
    [
      "solo (DeviceLocalAES)",
      getCurrentForm(CASE_ENCRYPTED_SOLO),
      getCurrentForm(CASE_DECRYPTED_SOLO),
      {
        [CASE_PARAMS_KEY_SOLO]: JSON.stringify(CASE_PARAMS_SOLO),
      },
    ],
    [
      "partner (Password)",
      getCurrentForm(CASE_ENCRYPTED_PARTNER),
      getCurrentForm(CASE_DECRYPTED_PARTNER),
      {
        [CASE_PARAMS_KEY_PARTNER]: JSON.stringify(CASE_PARAMS_PARTNER),
      },
    ],
  ])(
    "decrypts form %s",
    async (
      _,
      form: AnsweredForm,
      expectedForm: AnsweredForm,
      mockStorageData: Record<string, string>
    ) => {
      const mockStorage = new MockStorage();
      mockStorage.set(mockStorageData);
      const encryptionService = makeEncryptionService(mockStorage);

      const newForm = await encryptionService.decryptForm(form);

      expect(newForm).toEqual(expectedForm);
    }
  );
});

describe("CaseEncryptionService (DeviceLocalAES specific)", () => {
  it("creates a new key if missing", async () => {
    const saveFunc = jest.fn();
    const mockStorage: IStorage = {
      async getData(_): Promise<string | null> {
        return null;
      },
      saveData: saveFunc,
    };
    const encryptionService = makeEncryptionService(mockStorage);

    await encryptionService.encrypt(CASE_DECRYPTED_SOLO);

    expect(saveFunc).toHaveBeenCalled();
  });

  it("uses cached key if it exists", async () => {
    const getFunc = jest.fn();
    const saveFunc = jest.fn();
    const mockStorage: IStorage = {
      async getData(_): Promise<string | null> {
        getFunc();
        return JSON.stringify(CASE_PARAMS_SOLO);
      },
      saveData: saveFunc,
    };
    const encryptionService = makeEncryptionService(mockStorage);

    await encryptionService.encrypt(CASE_DECRYPTED_SOLO);

    expect(getFunc).toHaveBeenCalled();
    expect(saveFunc).not.toHaveBeenCalled();
  });
});

describe("CaseEncryptionService (Password specific)", () => {
  it("throws REQUIRES_PARAMS when missing password (encrypt)", async () => {
    const encryptionService = makeEncryptionService(new MockStorage());

    const func = async () => {
      await encryptionService.encrypt(CASE_DECRYPTED_PARTNER);
    };

    await expect(func).rejects.toThrow(EncryptionException);
    await expect(func).rejects.toThrow(
      expect.objectContaining(<Partial<EncryptionException>>{
        status: EncryptionErrorStatus.REQUIRES_PARAMS,
      })
    );
  });

  it("throws REQUIRES_PARAMS when missing password (decrypt)", async () => {
    const encryptionService = makeEncryptionService(new MockStorage());

    const func = async () => {
      await encryptionService.decrypt(CASE_ENCRYPTED_PARTNER);
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
    const mockStorage: IStorage = {
      async getData(_): Promise<string | null> {
        return null;
      },
      saveData: saveFunc,
    };

    const password = await PasswordStrategy.generateAndSaveBasicPinPassword(
      {
        encryptionDetails: getEncryptionFromCase(CASE_DECRYPTED_PARTNER),
      },
      { storage: mockStorage }
    );

    expect(typeof password).toBe("string");
    expect(password.length).toBeGreaterThan(0);
    expect(saveFunc).toHaveBeenCalledWith(
      CASE_PARAMS_KEY_PARTNER,
      expect.stringContaining(password)
    );
  });

  it("encrypts after generating a password", async () => {
    const mockStorage = new MockStorage();
    const encryptionService = makeEncryptionService(mockStorage);

    await PasswordStrategy.generateAndSaveBasicPinPassword(
      {
        encryptionDetails: getEncryptionFromCase(CASE_DECRYPTED_PARTNER),
      },
      { storage: mockStorage }
    );
    const newCase = await encryptionService.encrypt(CASE_DECRYPTED_PARTNER);
    const { answers, encryption } = getCurrentForm(newCase);

    expect(answersAreEncrypted(answers)).toBe(true);
    expect(encryption.type).toBe(EncryptionType.PASSWORD);
  });

  it("can retrieve existing password", async () => {
    const mockStorage = new MockStorage();
    const context: EncryptionContext = {
      encryptionDetails: getEncryptionFromCase(CASE_DECRYPTED_PARTNER),
    };
    const dependencies: EncryptionDependencies = { storage: mockStorage };

    const firstPassword = await PasswordStrategy.getPassword(
      context,
      dependencies
    );
    await PasswordStrategy.generateAndSaveBasicPinPassword(
      context,
      dependencies
    );
    const secondPassword = await PasswordStrategy.getPassword(
      context,
      dependencies
    );

    expect(firstPassword).toBeNull();
    expect(secondPassword).not.toBeNull();
  });

  it("can check if password exists", async () => {
    const mockStorage = new MockStorage();
    const context: EncryptionContext = {
      encryptionDetails: getEncryptionFromCase(CASE_DECRYPTED_PARTNER),
    };
    const dependencies: EncryptionDependencies = { storage: mockStorage };

    const firstCheck = await PasswordStrategy.hasPassword(
      context,
      dependencies
    );
    await PasswordStrategy.generateAndSaveBasicPinPassword(
      context,
      dependencies
    );
    const secondCheck = await PasswordStrategy.hasPassword(
      context,
      dependencies
    );

    expect(firstCheck).toBe(false);
    expect(secondCheck).toBe(true);
  });

  it("can provide a password to use", async () => {
    const mockStorage = new MockStorage();
    const context: EncryptionContext = {
      encryptionDetails: getEncryptionFromCase(CASE_DECRYPTED_PARTNER),
    };
    const dependencies: EncryptionDependencies = { storage: mockStorage };
    const testPassword = "test password";

    await PasswordStrategy.providePassword(testPassword, context, dependencies);
    const password = await PasswordStrategy.getPassword(context, dependencies);

    expect(password).toBe(testPassword);
  });
});

describe("CaseEncryptionService (simulated scenarios)", () => {
  test("partner resets app", async () => {
    const mockStorage = new MockStorage();
    await mockStorage.saveData(
      CASE_PARAMS_KEY_PARTNER,
      JSON.stringify(CASE_PARAMS_PARTNER)
    );
    const encryptionService = makeEncryptionService(mockStorage);
    const firstDecrypt = await encryptionService.decrypt(
      CASE_ENCRYPTED_PARTNER
    );

    mockStorage.clear();

    const [decryptError] = await to(
      encryptionService.decrypt(CASE_ENCRYPTED_PARTNER)
    );

    await mockStorage.saveData(
      CASE_PARAMS_KEY_PARTNER,
      JSON.stringify(CASE_PARAMS_PARTNER)
    );
    const secondDecrypt = await encryptionService.decrypt(
      CASE_ENCRYPTED_PARTNER
    );

    expect(firstDecrypt).toEqual(secondDecrypt);
    expect(decryptError).toBeDefined();
    expect(decryptError).toBeInstanceOf(EncryptionException);
    expect((decryptError as EncryptionException).status).toBe(
      EncryptionErrorStatus.REQUIRES_PARAMS
    );
  });
});
