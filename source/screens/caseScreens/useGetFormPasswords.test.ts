import { renderHook } from "@testing-library/react-hooks";
import useGetFormPassword from "./useGetFormPasswords";

import * as caseEncryptionHelper from "../../services/encryption/CaseEncryptionHelper";

import type { Case } from "../../types/Case";
import type { User } from "../../types/UserTypes";

jest.mock("../../services/encryption/CaseEncryptionHelper");
jest.mock("../../services/storage/StorageService");

function createTestCase(caseId: string, symmetricKeyName: string | null) {
  return {
    currentFormId: "formId",
    id: caseId,
    forms: {
      formId: {
        encryption: {
          symmetricKeyName,
        },
      },
    },
  } as unknown as Case;
}

const user = {
  personalNumber: "199009011234",
} as unknown as User;

beforeEach(() => {
  jest.resetAllMocks();
});

it("returns form passwords for single case", async () => {
  jest
    .spyOn(caseEncryptionHelper, "getPasswordForForm")
    .mockResolvedValueOnce("password1");

  const expectedResult = {
    caseId: "password1",
  };
  const caseItems = {
    caseId: createTestCase("caseId", "keyName"),
  };

  const { result, waitForNextUpdate } = renderHook(() =>
    useGetFormPassword(caseItems, user)
  );

  await waitForNextUpdate();

  expect(result.current).toEqual(expectedResult);
});

it("returns null as password when symmetricKeyName is missing", async () => {
  jest
    .spyOn(caseEncryptionHelper, "getPasswordForForm")
    .mockResolvedValueOnce("password1");

  const expectedResult = {
    caseId: null,
  };
  const caseItems = {
    caseId: createTestCase("caseId", null),
  };

  const { result, waitForNextUpdate } = renderHook(() =>
    useGetFormPassword(caseItems, user)
  );

  await waitForNextUpdate();

  expect(result.current).toEqual(expectedResult);
});

it("returns passwords for multiple cases", async () => {
  jest
    .spyOn(caseEncryptionHelper, "getPasswordForForm")
    .mockResolvedValueOnce("password1")
    .mockResolvedValueOnce("password2");

  const expectedResult = {
    caseId1: "password1",
    caseId2: "password2",
  };
  const caseItems = {
    caseId1: createTestCase("caseId1", "keyName1"),
    caseId2: createTestCase("caseId2", "keyName2"),
  };

  const { result, waitForNextUpdate } = renderHook(() =>
    useGetFormPassword(caseItems, user)
  );

  await waitForNextUpdate();

  expect(result.current).toEqual(expectedResult);
});

it("returns passwords only for cases with symmetricKeyName", async () => {
  jest
    .spyOn(caseEncryptionHelper, "getPasswordForForm")
    .mockResolvedValueOnce("password1");

  const expectedResult = {
    caseId1: "password1",
    caseId2: null,
  };
  const caseItems = {
    caseId1: createTestCase("caseId1", "keyName1"),
    caseId2: createTestCase("caseId2", null),
  };

  const { result, waitForNextUpdate } = renderHook(() =>
    useGetFormPassword(caseItems, user)
  );

  await waitForNextUpdate();

  expect(result.current).toEqual(expectedResult);
});
