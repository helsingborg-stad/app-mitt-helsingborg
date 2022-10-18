import type { StyleProp, TextStyle } from "react-native";
import type { PrimaryColor } from "../../../theme/themeHelpers";

export type Size = "small" | "medium" | "large";

export interface Props {
  size?: Size;
  colorSchema?: PrimaryColor;
  underline?: boolean;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
  help?: {
    text: string;
    size?: number;
    heading?: string;
    tagline?: string;
    url?: string;
  };
}
