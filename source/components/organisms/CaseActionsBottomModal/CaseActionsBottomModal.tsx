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
} from "./CaseActionsBottomModal.styled";

import type { Props } from "./CaseActionsBottomModal.types";

function CaseActionsBottomModal({
  isDownloadPdfDisabled,
  isRemoveCaseDisabled,
  isVisible,
  onCloseModal,
  onDownloadPdf,
  onRemoveCase,
}: Props): JSX.Element {
  const actionButtons = [
    {
      text: "Hämta avslutad ansökan som PDF",
      onPress: onDownloadPdf,
      isDisabled: isDownloadPdfDisabled,
    },
    {
      text: "Ta bort ansökan",
      onPress: onRemoveCase,
      isDisabled: isRemoveCaseDisabled,
    },
  ];

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
        {actionButtons.map(({ onPress, text, isDisabled }, index) => (
          <>
            <ModalButton key={text} onPress={onPress} disabled={isDisabled}>
              <ModalButtonText>{text}</ModalButtonText>
            </ModalButton>
            {index !== actionButtons.length - 1 && <Divider />}
          </>
        ))}
      </ModalContentContainer>

      <ModalCloseButton
        activeOpacity={0.8}
        underlayColor="#eee"
        onPress={onCloseModal}
        disabled={isRemoveCaseDisabled}
      >
        <ModalButtonText bold>Avbryt</ModalButtonText>
      </ModalCloseButton>
    </Modal>
  );
}

export default CaseActionsBottomModal;
