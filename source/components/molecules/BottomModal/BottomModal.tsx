import React, { useContext } from "react";
import Modal from "react-native-modal";
import { ThemeContext } from "styled-components/native";

import ModalNavigator from "./ModalNavigator";

import { ModalContentContainer } from "./styled";

import { ThemeType } from "../../../styles/themeHelpers";

interface Props {
  modalTitle?: string;
  visible: boolean;
  children: React.ReactChild | React.ReactChildren;
  colorSchema?: "red" | "neutral";
  backButtonText?: string;
  closeButtonText?: string;
  propagateSwipe?: boolean;
  onClose?: () => void;
  onBack?: () => void;
  onModalHide?: () => void;
}
const BottomModal = (props: Props): JSX.Element => {
  const {
    visible,
    children,
    onModalHide,
    modalTitle = undefined,
    onClose = undefined,
    backButtonText = undefined,
    onBack = undefined,
    closeButtonText = undefined,
    colorSchema = "neutral",
    propagateSwipe = false,
  } = props;

  const { colors } = useContext<ThemeType>(ThemeContext);

  const navigatorColor =
    colorSchema === "neutral" ? "white" : colors.primary.red[1];
  const textColor = colorSchema === "neutral" ? colors.neutrals[1] : "white";

  return (
    <Modal
      hideModalContentWhileAnimating
      isVisible={visible}
      style={{
        margin: 0,
        justifyContent: "flex-end",
        backgroundColor: "transparent",
      }}
      swipeDirection="down"
      onSwipeComplete={onClose}
      backdropTransitionOutTiming={0}
      onModalWillHide={onModalHide}
      propagateSwipe={propagateSwipe}
    >
      <ModalContentContainer>
        <ModalNavigator
          title={modalTitle}
          color={navigatorColor}
          textColor={textColor}
          onBack={onBack}
          onClose={onClose}
          backButtonText={backButtonText}
          closeButtonText={closeButtonText}
        />
        {children}
      </ModalContentContainer>
    </Modal>
  );
};

export default BottomModal;
