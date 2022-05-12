import { PrimaryColor } from "../../../styles/themeHelpers";
import { Answers } from "../../../types/AnswerTypes";
import { File } from "../FilePicker/FilePicker";

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
