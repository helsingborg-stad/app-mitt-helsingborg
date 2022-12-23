import type { PrimaryColor } from "../../../theme/themeHelpers";

import type {
  ValidationObject,
  ValidationRule,
} from "../../../types/Validation";
import type { Help } from "../../../types/FormTypes";

interface InputValidation {
  isRequired: boolean;
  rules: ValidationRule[];
}

type InputType =
  | "text"
  | "email"
  | "postalCode"
  | "personalNumber"
  | "phone"
  | "number"
  | "date"
  | "select";

interface SelectItem {
  label: string;
  value: string;
}

export interface Input {
  label: string;
  key: string;
  type: InputType;
  validation: InputValidation;
  disabled: boolean;
  inputSelectValue: string;
  loadPrevious: string[];
  tags: string[];
  title: string;
  items: SelectItem[];
}

export type Answer = Record<string, string | number>;

export interface Props {
  colorSchema: PrimaryColor;
  title: string;
  inputs: Input[];
  value: Answer;
  inputIsEditable: boolean;
  startEditable: boolean;
  help: Help;
  error: Record<string, ValidationObject>;
  onInputChange: (state: Answer) => void;
  onBlur: (state: Answer) => void;
  onFocus: (event: unknown, isSelect: boolean) => void;
}
