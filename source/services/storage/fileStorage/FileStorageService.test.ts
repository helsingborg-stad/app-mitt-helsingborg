import type {
  FileStorageUtil,
  IFileStorageService,
  RemoteUtil,
} from "./FileStorageService.types";
import { FileStorageService } from "./FileStorageService";
import { splitFilePath } from "../../../helpers/FileUpload";

const MOCK_FILE_ROOT = "/my/local/device/dir";
const MOCK_FILE_ID = "myLocalId";
const MOCK_DOWNLOAD_ROOT = "https://www.example.com";
const MOCK_FILE_PATH = `${MOCK_FILE_ROOT}/${MOCK_FILE_ID}`;
const MOCK_FILE_SYSTEM = [
  `${MOCK_FILE_ROOT}/a.txt`,
  `${MOCK_FILE_ROOT}/b.txt`,
  `${MOCK_FILE_ROOT}/subdir/x.jpg`,
  `${MOCK_FILE_ROOT}/subdir/y.jpg`,
  `${MOCK_FILE_ROOT}/subdir/z.png`,
  `${MOCK_FILE_ROOT}/subdir/another/1.pdf`,
];
const MOCK_FILE_SYSTEM_WITH_DIRS = [
  ...MOCK_FILE_SYSTEM,
  `${MOCK_FILE_ROOT}/subdir`,
  `${MOCK_FILE_ROOT}/subdir/another`,
];
const MOCK_FILE_CONTENTS = [
  "Lorem ipsum dolor sit amet, consectetur adipisicing elit. ",
  "Rerum cupiditate perspiciatis aperiam alias modi numquam, ",
  "voluptas error quod nesciunt! Consequuntur voluptate nemo ",
  "fugiat et ducimus facere voluptatibus rerum, totam reprehenderit.",
].join("");

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
    async isDir(maybeDir: string): Promise<boolean> {
      return splitFilePath(maybeDir).ext.length === 0;
    },
    async ls(dir: string): Promise<string[]> {
      const related = MOCK_FILE_SYSTEM_WITH_DIRS.filter((path) =>
        path.startsWith(dir)
      )
        .map((path) => path.substring(dir.length + 1))
        .filter(Boolean);
      return related.filter((path) => !path.includes("/"));
    },
    async readFile(_path): Promise<string> {
      return MOCK_FILE_CONTENTS;
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

  it("lists all files", async () => {
    const { MOCK_STORAGE_SERVICE } = createMockFileStorageService();

    const result = await MOCK_STORAGE_SERVICE.getFileList();

    expect(result).toEqual(MOCK_FILE_SYSTEM);
  });

  it("reads file contents", async () => {
    const { MOCK_STORAGE_SERVICE } = createMockFileStorageService();

    const result = await MOCK_STORAGE_SERVICE.getFileContents(MOCK_FILE_ID);

    expect(result).toBe(MOCK_FILE_CONTENTS);
  });
});
