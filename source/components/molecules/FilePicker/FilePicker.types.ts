import type { Pdf } from "../PdfItem/PdfItem.types";
import type { Image } from "../ImageItem/ImageItem.types";
import type { PrimaryColor } from "../../../theme/themeHelpers";

export enum FileType {
  ALL = "all",
  PDF = "pdf",
  IMAGES = "images",
}

export type File = Image | Pdf;

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
