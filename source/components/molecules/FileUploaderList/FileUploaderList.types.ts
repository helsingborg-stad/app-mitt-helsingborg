import type { PrimaryColor } from "../../../theme/themeHelpers";
import type { Answers } from "../../../types/AnswerTypes";
import type { File } from "../FilePicker/FilePicker";

export interface FileUploaderProps {
  id: string;
  colorSchema: PrimaryColor;
  values: string[];
  answers: Answers;
  onChange: (value: File[], id: string) => void;
}

export interface FileUploaderInternalItem {
  id: string;
  text: string;
  files: File[];
}
