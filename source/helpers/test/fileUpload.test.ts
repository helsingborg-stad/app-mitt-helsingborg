import { splitFilePath } from "../FileUpload";

describe("fileUpload", () => {
  describe("splitFilePath", () => {
    const TEST_DEEP_DIR = "/somedir/subdir/subdir2";
    const TEST_NAME = "filename";
    const TEST_EXT = ".jpg";
    const TEST_NAME_EXT = "filename.jpg";
    const TEST_FILEPATH_FULL = `${TEST_DEEP_DIR}/${TEST_NAME}${TEST_EXT}`;

    it("gets dir", () => {
      const { dir } = splitFilePath(TEST_FILEPATH_FULL);

      expect(dir).toBe(TEST_DEEP_DIR);
    });

    it("gets name", () => {
      const { name } = splitFilePath(TEST_FILEPATH_FULL);

      expect(name).toBe(TEST_NAME);
    });

    it("gets ext", () => {
      const { ext } = splitFilePath(TEST_FILEPATH_FULL);

      expect(ext).toBe(TEST_EXT);
    });

    it("gets name with ext", () => {
      const { nameWithExt } = splitFilePath(TEST_FILEPATH_FULL);

      expect(nameWithExt).toBe(TEST_NAME_EXT);
    });

    it("handles path without dirs", () => {
      const { dir, name, ext, nameWithExt } = splitFilePath(
        `${TEST_NAME}${TEST_EXT}`
      );

      expect(dir).toBeFalsy();
      expect(name).toBe(TEST_NAME);
      expect(ext).toBe(TEST_EXT);
      expect(nameWithExt).toBe(TEST_NAME_EXT);
    });

    it("handles path without ext", () => {
      const { dir, name, ext, nameWithExt } = splitFilePath(
        `${TEST_DEEP_DIR}/${TEST_NAME}`
      );

      expect(dir).toBe(TEST_DEEP_DIR);
      expect(name).toBe(TEST_NAME);
      expect(ext).toBeFalsy();
      expect(nameWithExt).toBe(TEST_NAME);
    });

    it("handles path with multiple ext", () => {
      const { dir, name, ext, nameWithExt } = splitFilePath(
        `${TEST_DEEP_DIR}/${TEST_NAME}.err.log`
      );

      expect(dir).toBe(TEST_DEEP_DIR);
      expect(name).toBe(TEST_NAME);
      expect(ext).toBe(".err.log");
      expect(nameWithExt).toBe(`${TEST_NAME}.err.log`);
    });

    it("handles empty path", () => {
      const { dir, name, ext, nameWithExt } = splitFilePath("");

      expect(dir).toBeFalsy();
      expect(name).toBeFalsy();
      expect(ext).toBeFalsy();
      expect(nameWithExt).toBeFalsy();
    });
  });
});
