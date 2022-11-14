import type {
  FileStorageUtil,
  IFileStorageService,
  RemoteUtil,
} from "./FileStorageService.types";
import { FileStorageService } from "./FileStorageService";

const MOCK_FILE_ROOT = "/my/local/device/dir";
const MOCK_FILE_ID = "myLocalId";
const MOCK_DOWNLOAD_ROOT = "https://www.example.com";
const MOCK_FILE_PATH = `${MOCK_FILE_ROOT}/${MOCK_FILE_ID}`;

function createMockFileStorageService(): {
  MOCK_STORAGE_SERVICE: IFileStorageService;
  MOCK_STORAGE_UTIL: FileStorageUtil;
} {
  let MOCK_CACHE = [`${MOCK_FILE_ROOT}/${MOCK_FILE_ID}`];

  const MOCK_STORAGE_UTIL: FileStorageUtil = {
    getDocumentRoot() {
      return MOCK_FILE_ROOT;
    },
    async exists(filePath: string): Promise<boolean> {
      return MOCK_CACHE.includes(filePath);
    },
    async downloadFileToCache(url: string, cachePath: string): Promise<void> {
      MOCK_CACHE.push(cachePath);
    },
    async copyFile(
      sourcePath: string,
      destinationPath: string
    ): Promise<boolean> {
      MOCK_CACHE.push(destinationPath);
      return true;
    },
    async removeFile(filePath: string): Promise<void> {
      MOCK_CACHE = MOCK_CACHE.filter((i) => i !== filePath);
    },
  };

  const MOCK_REMOTE_UTIL: RemoteUtil = {
    async getDownloadUrl(id: string): Promise<string> {
      return `${MOCK_DOWNLOAD_ROOT}/${id}`;
    },
  };

  return {
    MOCK_STORAGE_SERVICE: new FileStorageService(
      MOCK_STORAGE_UTIL,
      MOCK_REMOTE_UTIL
    ),
    MOCK_STORAGE_UTIL,
  };
}

describe("FileStorageService", () => {
  it("returns correct file path", () => {
    const { MOCK_STORAGE_SERVICE } = createMockFileStorageService();

    const result = MOCK_STORAGE_SERVICE.getFilePath(MOCK_FILE_ID);

    expect(result).toBe(MOCK_FILE_PATH);
  });

  it("returns a new id when copying to cache", async () => {
    const uuidRegex =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
    const { MOCK_STORAGE_SERVICE } = createMockFileStorageService();

    const result = await MOCK_STORAGE_SERVICE.copyFileToCache("fake/file/path");

    expect(result).toMatch(uuidRegex);
  });

  it("removes file from cache", async () => {
    const { MOCK_STORAGE_SERVICE, MOCK_STORAGE_UTIL } =
      createMockFileStorageService();

    const existsBeforeRemove = await MOCK_STORAGE_UTIL.exists(MOCK_FILE_PATH);
    await MOCK_STORAGE_SERVICE.removeFile(MOCK_FILE_ID);
    const existsAfterRemove = await MOCK_STORAGE_UTIL.exists(MOCK_FILE_PATH);

    expect(existsBeforeRemove).toBe(true);
    expect(existsAfterRemove).toBe(false);
  });

  it("does nothing if there is no file to remove", async () => {
    const { MOCK_STORAGE_SERVICE } = createMockFileStorageService();
    const func = async () =>
      MOCK_STORAGE_SERVICE.removeFile("file/does/not/exist");

    await expect(func()).resolves.not.toThrow();
  });

  it("downloads file if necessary", async () => {
    const mockFileId = "does/not/exist/yet";
    const mockRemoteId = "some/remote/path";
    const { MOCK_STORAGE_SERVICE, MOCK_STORAGE_UTIL } =
      createMockFileStorageService();
    const spy = jest.spyOn(MOCK_STORAGE_UTIL, "downloadFileToCache");

    await MOCK_STORAGE_SERVICE.ensureFile(mockFileId, mockRemoteId);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      `${MOCK_DOWNLOAD_ROOT}/${mockRemoteId}`,
      `${MOCK_FILE_ROOT}/${mockFileId}`
    );
  });

  it("does not download file if already available", async () => {
    const { MOCK_STORAGE_SERVICE, MOCK_STORAGE_UTIL } =
      createMockFileStorageService();
    const spy = jest.spyOn(MOCK_STORAGE_UTIL, "downloadFileToCache");

    await MOCK_STORAGE_SERVICE.ensureFile(MOCK_FILE_ID, "");

    expect(spy).not.toHaveBeenCalled();
  });
});
