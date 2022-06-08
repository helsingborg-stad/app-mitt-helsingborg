import React from "react";
import {
  Modal as ReactNativeModal,
  ModalProps as ReactNativeModalProps,
} from "react-native";

interface ModalProps extends ReactNativeModalProps {
  visible: boolean;
  children: React.ReactNode | React.ReactNode[];
  hide?: () => void;
}

const Modal = ({
  visible,
  children,
  hide,
  ...other
}: ModalProps): JSX.Element => (
  <ReactNativeModal
    statusBarTranslucent={false}
    visible={visible}
    animationType="slide"
    transparent={false}
    onRequestClose={hide}
    presentationStyle="pageSheet"
    {...other}
  >
    {children}
  </ReactNativeModal>
);

export default Modal;
