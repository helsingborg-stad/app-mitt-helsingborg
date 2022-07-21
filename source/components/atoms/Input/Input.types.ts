import type { TextInputProps } from "react-native";

import type { PrimaryColor, ThemeType } from "../../../styles/themeHelpers";

import type { InputFieldType } from "../../../types/FormTypes";

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

export type KeyboardTypeExtraPropType = Partial<
  Record<InputFieldType, Partial<Props>>
>;
