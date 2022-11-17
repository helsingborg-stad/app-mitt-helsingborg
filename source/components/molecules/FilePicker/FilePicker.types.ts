import type { PrimaryColor } from "../../../theme/themeHelpers";

export enum FileType {
  ALL = "all",
  PDF = "pdf",
  IMAGES = "images",
}

export interface File {
  externalDisplayName: string;
  uploadedId: string;
  deviceFileName: string;
  mime: string;
  id: string;
  index?: number;
  questionId: string;
}

export interface ErrorValidation {
  isValid: boolean;
  message: string;
}

export interface Props {
  buttonText: string;
  value: File[] | "";
  answers: Record<string, File[]>;
  colorSchema: PrimaryColor;
  id: string;
  preferredFileName?: string;
  fileType: FileType;
  error?: ErrorValidation;
  onChange: (value: File[], id: string) => void;
}
