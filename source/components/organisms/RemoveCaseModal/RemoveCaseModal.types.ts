import type { PrimaryColor } from "../../../theme/themeHelpers";

export interface Props {
  visible: boolean;
  onCloseModal: () => void;
  onRemoveCase: () => Promise<void>;
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

export enum RemoveCaseState {
  Default,
  Loading,
  Error,
}
