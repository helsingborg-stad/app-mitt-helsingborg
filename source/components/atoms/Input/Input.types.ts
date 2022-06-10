import { TextInputProps } from "react-native";

import { PrimaryColor, ThemeType } from "../../../styles/themeHelpers";

import { InputFieldType } from "../../../types/FormTypes";

export interface ErrorValidation {
  isValid: boolean;
  message: string;
}

export type Props = Omit<TextInputProps, "onBlur"> & {
  onBlur?: (value: string) => void;
  onMount?: (value: string) => void;
  center?: boolean;
  transparent?: boolean;
  colorSchema?: PrimaryColor;
  showErrorMessage?: boolean;
  hidden?: boolean;
  error?: ErrorValidation;
  textAlign?: "left" | "center" | "right";
  inputType?: InputFieldType;
  theme?: ThemeType;
};

export type KeyboardTypeExtraPropType = Record<InputFieldType, Partial<Props>>;
