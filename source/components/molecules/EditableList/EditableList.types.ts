import type { LayoutChangeEvent } from "react-native";
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

export interface Input {
  label: string;
  key: string;
  type: string;
  validation: InputValidation;
  disabled: boolean;
  inputSelectValue: string;
  loadPrevious: string[];
  tags: string[];
  title: string;
}

export type Answer = Record<string, string>;

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
  onFocus: (event: LayoutChangeEvent, isSelect: boolean) => void;
}
