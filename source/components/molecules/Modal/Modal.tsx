import React from "react";
import { Modal as ReactNativeModal } from "react-native";
import { Props } from "./Modal.types";
import ModalView from "./Modal.styled";

const Modal = ({
  visible,
  children,
  statusBarTranslucent = true,
  backgroundBlur = true,
  transparent = true,
  hide,
  ...other
}: Props): JSX.Element => (
  <ReactNativeModal
    statusBarTranslucent={statusBarTranslucent}
    visible={visible}
    animationType="slide"
    transparent={transparent}
    onRequestClose={hide}
    presentationStyle="pageSheet"
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...other}
  >
    <ModalView blur={backgroundBlur}>{children}</ModalView>
  </ReactNativeModal>
);

export default Modal;
