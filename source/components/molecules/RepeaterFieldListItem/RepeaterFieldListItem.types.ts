import type { InputFieldType } from "../../../types/FormTypes";
import type { PrimaryColor } from "../../../theme/themeHelpers";

interface InputRow {
  id: string;
  title: string;
  type: "text" | "date" | "number" | "hidden" | "select";
  inputSelectValue: InputFieldType;
  value?: string;
}

export interface InputComponentProps {
  input: InputRow;
  colorSchema: PrimaryColor;
  value: string | number | boolean;
  error?: { isValid: boolean; message: string };
  showErrorMessage?: boolean;
  onChange: (value: string | number) => void;
  onFocus?: (e: FocusEvent) => void;
  onBlur: () => void;
}

export interface Props {
  heading?: string;
  listIndex?: number;
  inputs: InputRow[];
  value: Record<string, string | number>;
  error?: Record<string, { isValid: boolean; validationMessage: string }>;
  color: PrimaryColor;
  changeFromInput: (input: InputRow) => (text: string) => void;
  onBlur?: () => void;
  onFocus?: (e: unknown) => void;
  removeItem: () => void;
}
