import uuid from "react-native-uuid";
import path from "path";
import type {
  IFileStorageService,
  FileStorageUtil,
  RemoteUtil,
} from "./FileStorageService.types";
import reactNativeBlobUtilFileStorageUtil from "./fileStorageUtils/reactNativeBlobUtil";
import apiRemoteUtil from "./remoteUtils/apiRemoteUtil";

export class FileStorageService implements IFileStorageService {
  #fileStorageUtil: FileStorageUtil;

  #remoteUtil: RemoteUtil;

  constructor(fileStorageUtil: FileStorageUtil, remoteUtil: RemoteUtil) {
    this.#fileStorageUtil = fileStorageUtil;
    this.#remoteUtil = remoteUtil;
  }

  isFileLocallyAvailable(id: string): Promise<boolean> {
    const filePath = this.getFilePath(id);
    return this.#fileStorageUtil.exists(filePath);
  }

  async getDownloadUrl(remoteId: string): Promise<string> {
    return this.#remoteUtil.getDownloadUrl(remoteId);
  }

  async downloadFileToCache(
    localId: string,
    remoteId: string
  ): Promise<string> {
    const desiredFilePath = this.getFilePath(localId);
    const downloadUrl = await this.getDownloadUrl(remoteId);
    await this.#fileStorageUtil.downloadFileToCache(
      downloadUrl,
      desiredFilePath
    );
    return desiredFilePath;
  }

  getFilePath(id: string): string {
    return path.join(this.#fileStorageUtil.getDocumentRoot(), id);
  }

  async ensureFile(localId: string, remoteId: string): Promise<void> {
    const isFileCached = await this.isFileLocallyAvailable(localId);

    if (isFileCached) {
      return;
    }

    await this.downloadFileToCache(localId, remoteId);
  }

  async copyFileToCache(filePath: string): Promise<string> {
    const newId = uuid.v4() as string;
    const newFilePath = this.getFilePath(newId);
    await this.#fileStorageUtil.copyFile(filePath, newFilePath);
    return newId;
  }

  async removeFile(fileId: string): Promise<void> {
    const filePath = this.getFilePath(fileId);
    return this.#fileStorageUtil.removeFile(filePath);
  }
}

const defaultFileStorageService = new FileStorageService(
  reactNativeBlobUtilFileStorageUtil,
  apiRemoteUtil
);

export default defaultFileStorageService;
