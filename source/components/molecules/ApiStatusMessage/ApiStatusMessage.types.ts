import type { ThemeType } from "../../../theme/themeHelpers";
import type { Message, Type } from "../../../types/StatusMessages";

export interface ApiStatusMessageContainerProps {
  theme: ThemeType;
}

export interface MessageTextProps {
  color: string;
}

export interface Props {
  message: Message;
  type: Type;
}

export type StyleMap = {
  [key in Type]: {
    iconName: string;
    color: string;
  };
};
