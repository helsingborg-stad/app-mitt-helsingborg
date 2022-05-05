import DocumentPicker from "react-native-document-picker";
import uuid from "react-native-uuid";

import { Pdf } from "../PdfDisplay/PdfDisplay";
import { AllowedFileTypes, splitFilePath } from "../../../helpers/FileUpload";

const uriScheme = {
  file: "file://",
};

interface HookResponse {
  addPdfFromLibrary: (questionId: string) => Promise<Pdf[]>;
}
export default (): HookResponse => {
  const removeUriScheme = (path: string) =>
    path.startsWith(uriScheme.file) ? path.replace(uriScheme.file, "") : path;

  const addPdfFromLibrary = async (questionId: string) => {
    try {
      const newFiles = await DocumentPicker.pick({
        type: DocumentPicker.types.pdf,
        allowMultiSelection: true,
        copyTo: "cachesDirectory",
      });

      const filesWithQuestionId = newFiles.map((pdf) => {
        const split = splitFilePath(pdf?.name);
        const filePath = removeUriScheme(pdf.fileCopyUri ?? pdf.uri);

        return {
          ...pdf,
          questionId,
          filename: `${split.name}${split.ext}`,
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
  };

  return {
    addPdfFromLibrary,
  };
};
