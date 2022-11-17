import uuid from "react-native-uuid";
import { filterAsync } from "../../../helpers/Objects";
import type {
  IFileStorageService,
  FileStorageUtil,
  RemoteUtil,
} from "./FileStorageService.types";
import reactNativeBlobUtilFileStorageUtil from "./fileStorageUtils/reactNativeBlobUtil";
import apiRemoteUtil from "./remoteUtils/apiRemoteUtil";

export class FileStorageService implements IFileStorageService {
  private fileStorageUtil: FileStorageUtil;

  private remoteUtil: RemoteUtil;

  constructor(fileStorageUtil: FileStorageUtil, remoteUtil: RemoteUtil) {
    this.fileStorageUtil = fileStorageUtil;
    this.remoteUtil = remoteUtil;
  }

  private isFileLocallyAvailable(id: string): Promise<boolean> {
    const filePath = this.getFilePath(id);
    return this.fileStorageUtil.exists(filePath);
  }

  private async getDownloadUrl(remoteId: string): Promise<string> {
    return this.remoteUtil.getDownloadUrl(remoteId);
  }

  private async downloadFileToCache(
    localId: string,
    remoteId: string
  ): Promise<string> {
    const desiredFilePath = this.getFilePath(localId);
    const downloadUrl = await this.getDownloadUrl(remoteId);
    await this.fileStorageUtil.downloadFileToCache(
      downloadUrl,
      desiredFilePath
    );
    return desiredFilePath;
  }

  private async listFilesRecursive(dir: string): Promise<string[]> {
    const filesAndDirs = await this.fileStorageUtil.ls(dir);
    const absoluteFilesAndDirs = filesAndDirs.map(
      (fileOrDir) => `${dir}/${fileOrDir}`
    );

    const subdirs = await filterAsync(
      absoluteFilesAndDirs,
      this.fileStorageUtil.isDir
    );

    const files = absoluteFilesAndDirs.filter(
      (maybe) => !subdirs.includes(maybe)
    );

    const subdirContents = (
      await Promise.all(
        subdirs.map((subdir) => this.listFilesRecursive(subdir))
      )
    ).flat();

    return [...files, ...subdirContents];
  }

  getFilePath(id: string): string {
    return `${this.fileStorageUtil.getDocumentRoot()}/${id}`;
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
    await this.fileStorageUtil.copyFile(filePath, newFilePath);
    return newId;
  }

  async removeFile(id: string): Promise<void> {
    const filePath = this.getFilePath(id);
    return this.fileStorageUtil.removeFile(filePath);
  }

  getFileList(): Promise<string[]> {
    return this.listFilesRecursive(this.fileStorageUtil.getDocumentRoot());
  }

  getFileContents(id: string): Promise<string> {
    const filePath = this.getFilePath(id);
    return this.fileStorageUtil.readFile(filePath);
  }
}

const defaultFileStorageService = new FileStorageService(
  reactNativeBlobUtilFileStorageUtil,
  apiRemoteUtil
);

export default defaultFileStorageService;
