export interface FileStorageUtil {
  getDocumentRoot(): string;
  exists(filePath: string): Promise<boolean>;
  downloadFileToCache(url: string, cachePath: string): Promise<void>;
  copyFile(sourcePath: string, destinationPath: string): Promise<boolean>;
  removeFile(filePath: string): Promise<void>;
}

export interface RemoteUtil {
  getDownloadUrl(id: string): Promise<string>;
}

export interface IFileStorageService {
  getFilePath(id: string): string;
  ensureFile(localId: string, remoteId: string): Promise<void>;
  copyFileToCache(filePath: string): Promise<string>;
  removeFile(fileId: string): Promise<void>;
}
