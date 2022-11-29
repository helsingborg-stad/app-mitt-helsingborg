import type { PrimaryColor } from "../../../theme/themeHelpers";

export interface Props {
  visible: boolean;
  hasError: boolean;
  onRetryOpenForm: () => void;
  onCloseModal: () => void;
}

export interface ButtonSet {
  text: string;
  color: PrimaryColor;
  clickHandler: () => void | Promise<void>;
}

export interface ModalContent {
  text: {
    title: string;
    body: string;
  };
  buttons: ButtonSet[];
}
