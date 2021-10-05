import React, { useContext } from "react";
import Modal from "react-native-modal";
import { ThemeContext } from "styled-components/native";

import ModalNavigator from "./ModalNavigator";

import { ModalContentContainer } from "./styled";

const SWIPE_DIRECTION = {
  DOWN: "down",
  NONE: undefined,
};

interface Props {
  modalTitle?: string;
  visible: boolean;
  children: React.ReactChild | React.ReactChildren;
  colorSchema?: "red" | "neutral";
  backButtonText?: string;
  onClose?: () => void;
  onBack?: () => void;
}
const BottomModal = (props: Props): JSX.Element => {
  const {
    modalTitle,
    visible,
    onClose,
    backButtonText,
    onBack,
    colorSchema = "neutral",
    children,
  } = props;

  const theme = useContext(ThemeContext);

  const swipeDirection = onClose ? SWIPE_DIRECTION.DOWN : SWIPE_DIRECTION.NONE;

  const navigatorColor =
    colorSchema === "neutral" ? "white" : theme.colors.primary.red[1];
  const textColor =
    colorSchema === "neutral" ? theme.colors.neutrals[1] : "white";

  return (
    <Modal
      isVisible={visible}
      style={{ margin: 0, justifyContent: "flex-end" }}
      swipeDirection={swipeDirection}
      onSwipeComplete={onClose}
    >
      <ModalContentContainer>
        <ModalNavigator
          title={modalTitle}
          color={navigatorColor}
          textColor={textColor}
          onBack={onBack}
          onClose={onClose}
          backButtonText={backButtonText}
        />
        {children}
      </ModalContentContainer>
    </Modal>
  );
};

BottomModal.defaultProps = {
  modalTitle: undefined,
  colorSchema: "neutral",
  backButtonText: undefined,
  onClose: undefined,
  onBack: undefined,
};

export default BottomModal;
