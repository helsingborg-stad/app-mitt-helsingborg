import { PrimaryColor } from "../../../styles/themeHelpers";
import { Answers } from "../../../types/AnswerTypes";
import { File } from "../FilePicker/FilePicker";

export interface FileUploaderProps {
  id: string;
  colorSchema: PrimaryColor;
  list: string[];
  answers: Answers;
  onChange: (value: unknown, id: string) => void;
}

export interface FileUploaderInternalItem {
  id: string;
  text: string;
  files: File[];
}
