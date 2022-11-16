import DocumentPicker from "react-native-document-picker";
import type { DocumentPickerResponse } from "react-native-document-picker";

import defaultFileStorageService from "../../../services/storage/fileStorage/FileStorageService";
import type { File } from "./FilePicker.types";

const uriScheme = {
  file: "file://",
};

export function removeUriScheme(path: string): string {
  return path.startsWith(uriScheme.file)
    ? path.replace(uriScheme.file, "")
    : path;
}

async function createCacheFile(
  pick: DocumentPickerResponse,
  questionId: string
): Promise<File> {
  const path = removeUriScheme(pick.fileCopyUri ?? pick.uri);
  const newId = await defaultFileStorageService.copyFileToCache(path);
  return {
    id: newId,
    deviceFileName: pick.name,
    externalDisplayName: pick.name,
    mime: pick.type ?? "application/pdf",
    questionId,
  };
}

export async function addPdfFromLibrary(questionId: string): Promise<File[]> {
  try {
    const picks = await DocumentPicker.pick({
      type: DocumentPicker.types.pdf,
      allowMultiSelection: true,
      copyTo: "cachesDirectory",
    });

    const createCacheFileWithQuestionId = (file: DocumentPickerResponse) =>
      createCacheFile(file, questionId);

    return Promise.all(picks.map(createCacheFileWithQuestionId));
  } catch (error) {
    if (!DocumentPicker.isCancel(error)) {
      console.error("Error while adding pdf from library:", error);
    }
  }
  return [];
}
