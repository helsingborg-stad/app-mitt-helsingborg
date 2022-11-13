export interface TransparentModalButton {
  title: string;
  onPress: () => void;
}

export interface Props {
  isVisible: boolean;
  modalButtons: TransparentModalButton[];
  onCloseModal: () => void;
}
