import React from "react";
import styled from "styled-components/native";
import {
  Modal as ReactNativeModal,
  ModalProps as ReactNativeModalProps,
  Platform,
} from "react-native";

interface ModalViewProps {
  blur: boolean;
}

export const ModalView = styled.View<ModalViewProps>`
  ${({ blur }) =>
    blur &&
    ` position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 1000;
      padding: 0px;
      background-color: ${
        Platform.OS === "android"
          ? "rgba(0, 0, 0, 0.55)"
          : "rgba(0, 0, 0, 0.75)"
      };
    `}
  flex: 1;
`;

interface ModalProps extends ReactNativeModalProps {
  visible: boolean;
  children: React.ReactNode | React.ReactNode[];
  backgroundBlur?: boolean;
  hide?: () => void;
}

const Modal = ({
  visible,
  children,
  statusBarTranslucent = true,
  backgroundBlur = true,
  transparent = true,
  hide,
  ...other
}: ModalProps): JSX.Element => (
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
