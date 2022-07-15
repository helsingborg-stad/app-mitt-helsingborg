import type {
  PrimaryColor,
  ComplementaryColor,
  ThemeType,
} from "../../../styles/themeHelpers";

export interface DefaultStyledProps {
  theme: ThemeType;
}

export interface Props {
  visible: boolean;
  heading?: string;
  markdownText: string;
  buttonText?: string;
  colorSchema: PrimaryColor | ComplementaryColor;
  toggleModal: () => void;
}
