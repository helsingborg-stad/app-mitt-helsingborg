import DocumentPicker from "react-native-document-picker";
import uuid from "react-native-uuid";

import type { Pdf } from "../PdfDisplay/PdfDisplay";

import type { AllowedFileTypes } from "../../../helpers/FileUpload";
import { splitFilePath } from "../../../helpers/FileUpload";

const uriScheme = {
  file: "file://",
};

export function removeUriScheme(path: string): string {
  return path.startsWith(uriScheme.file)
    ? path.replace(uriScheme.file, "")
    : path;
}

export async function addPdfFromLibrary(questionId: string): Promise<Pdf[]> {
  try {
    const newFiles = await DocumentPicker.pick({
      type: DocumentPicker.types.pdf,
      allowMultiSelection: true,
      copyTo: "cachesDirectory",
    });

    const filesWithQuestionId = newFiles.map((pdf) => {
      const split = splitFilePath(pdf?.name);
      const filePath = removeUriScheme(pdf.fileCopyUri ?? pdf.uri);

      const filename = `${split.name}${split.ext}`;

      return {
        ...pdf,
        questionId,
        filename,
        displayName: filename,
        fileType: "pdf" as AllowedFileTypes,
        path: filePath,
        id: uuid.v4() as string,
      } as Pdf;
    });

    return filesWithQuestionId;
  } catch (error) {
    if (!DocumentPicker.isCancel(error as Error)) {
      console.error("Error while adding pdf from library:", error);
    }
  }
  return [];
}
