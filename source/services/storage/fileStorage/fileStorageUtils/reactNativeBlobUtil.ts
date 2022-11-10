import ReactNativeBlobUtil from "react-native-blob-util";
import type { FileStorageUtil } from "../FileStorageService.types";

const reactNativeBlobUtilFileStorageUtil: FileStorageUtil = {
  getDocumentRoot(): string {
    return ReactNativeBlobUtil.fs.dirs.DocumentDir;
  },

  exists(filePath: string) {
    return ReactNativeBlobUtil.fs.exists(filePath);
  },

  async downloadFileToCache(
    url: string,
    destinationPath: string
  ): Promise<void> {
    await ReactNativeBlobUtil.config({
      path: destinationPath,
    }).fetch("GET", url);
  },

  copyFile(sourcePath: string, destinationPath: string): Promise<boolean> {
    return ReactNativeBlobUtil.fs.cp(sourcePath, destinationPath);
  },

  removeFile(filePath: string): Promise<void> {
    return ReactNativeBlobUtil.fs.unlink(filePath);
  },
};

export default reactNativeBlobUtilFileStorageUtil;
