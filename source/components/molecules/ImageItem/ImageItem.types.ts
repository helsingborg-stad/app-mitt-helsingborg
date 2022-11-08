import type { Image as CropPickerImage } from "react-native-image-crop-picker";
import type { AllowedFileTypes } from "../../../helpers/FileUpload";

export type FileStatus =
  | "checkLocalFile"
  | "localFileAvailable"
  | "downloading"
  | "downloadedFileAvailable";

export interface Image extends CropPickerImage {
  errorMessage?: string;
  uploadedFileName?: string;
  url?: string;
  index?: number;
  questionId: string;
  fileType: AllowedFileTypes;
  displayName: string;
  id: string;
}

export interface Props {
  image: Image;
  onRemove: () => void;
  onChange?: (image: Image) => void;
}
