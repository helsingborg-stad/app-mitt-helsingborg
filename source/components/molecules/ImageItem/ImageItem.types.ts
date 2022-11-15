import type { File } from "../FilePicker/FilePicker.types";

export interface Props {
  file: File;
  onRemove: () => void;
}
