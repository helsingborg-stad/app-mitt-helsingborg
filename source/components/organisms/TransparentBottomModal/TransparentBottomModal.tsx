import React from "react";
import Modal from "react-native-modal";

import {
  ModalContentContainer,
  ModalHeaderTextContainer,
  ModalHeaderText,
  ModalButton,
  ModalCloseButton,
  ModalButtonText,
  Divider,
  modalStyle,
} from "./TransparentBottomModal.styled";

import type { Props } from "./TransparentBottomModal.types";

function TransparentBottomModal({
  isVisible,
  modalButtons,
  onCloseModal,
}: Props): JSX.Element {
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.3}
      style={modalStyle.modal}
      useNativeDriver
      onBackdropPress={onCloseModal}
    >
      <ModalContentContainer>
        <ModalHeaderTextContainer>
          <ModalHeaderText>Hantera ansökan</ModalHeaderText>
        </ModalHeaderTextContainer>
        <Divider />

        {modalButtons.map(({ title, onPress }, index) => (
          <>
            <ModalButton key={title} onPress={onPress}>
              <ModalButtonText>{title}</ModalButtonText>
            </ModalButton>
            {index !== modalButtons.length - 1 && <Divider />}
          </>
        ))}
      </ModalContentContainer>

      <ModalCloseButton
        activeOpacity={0.8}
        underlayColor="#eee"
        onPress={onCloseModal}
      >
        <ModalButtonText bold>Avbryt</ModalButtonText>
      </ModalCloseButton>
    </Modal>
  );
}

export default TransparentBottomModal;
