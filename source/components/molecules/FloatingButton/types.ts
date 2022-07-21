import type { ThemeType } from "../../../styles/themeHelpers";

interface CommonProps {
  colorSchema?: "red" | "neutral";
  position?: "left" | "right" | "center";
  borderRadius?: 16 | 27;
  buttonWidth?: string | number;
  justifyContent?: "flex-start" | "flex-end" | "center";
}

export interface StyledProps extends CommonProps {
  theme: ThemeType;
}

export interface FloatingButtonProps extends CommonProps {
  onPress: () => void;
  text?: string;
  iconName?: string;
  iconSize?: 16 | 24 | 32 | 48;
}
