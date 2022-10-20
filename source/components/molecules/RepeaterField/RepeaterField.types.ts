import type { InputFieldType } from "../../../types/FormTypes";
import type { PrimaryColor } from "../../../theme/themeHelpers";

export type Answer = Record<string, string | number>;

export interface InputRow {
  id: string;
  title: string;
  type: "text" | "date" | "number" | "hidden" | "select";
  inputSelectValue: InputFieldType;
  value?: string;
}

export interface Props {
  heading: string;
  addButtonText?: string;
  inputs: InputRow[];
  value: string | Answer[];
  onChange: (answers: Answer[], fieldId?: string) => void;
  onBlur?: (answers: Answer[], fieldId?: string) => void;
  onAddAnswer?: (answers: Answer[], fieldId?: string) => void;
  onFocus?: (event: FocusEvent) => void;
  colorSchema: PrimaryColor;
  error?: Record<string, { isValid: boolean; validationMessage: string }>[];
  maxRows?: number;
}
