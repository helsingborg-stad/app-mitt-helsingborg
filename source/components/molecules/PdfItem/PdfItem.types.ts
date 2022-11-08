import type { DocumentPickerResponse } from "react-native-document-picker";

import type { AllowedFileTypes } from "../../../helpers/FileUpload";

export interface Pdf extends DocumentPickerResponse {
  errorMessage?: string;
  uploadedFileName?: string;
  url?: string;
  questionId: string;
  fileCopyUri: string;
  name: string;
  size: number;
  type: string;
  fileType: AllowedFileTypes;
  path: string;
  filename?: string;
  displayName: string;
  id: string;
}

export interface Props {
  pdf: Pdf;
  onRemove: () => void;
}
