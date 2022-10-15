import type { ViewStyle } from "react-native";

export interface Props {
  items: { label: string; value: string }[];
  onValueChange: (value: string | null, index?: number) => void;
  placeholder?: string;
  value: string;
  editable?: boolean;
  style?: ViewStyle;
  onBlur: (value: string | null) => void;
  onOpen: (event: unknown, isSelect: boolean) => void;
  onClose: (event: unknown, isSelect: boolean) => void;
  showErrorMessage?: boolean;
  error?: { isValid: boolean; message: string };
}
