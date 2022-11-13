import { StyleSheet } from "react-native";
import styled, { css } from "styled-components/native";

const ModalContentContainer = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #eee;
  border-radius: 12px;
  margin-bottom: 8px;
`;

const ModalHeaderTextContainer = styled.View`
  align-items: center;
  padding: 8px 0px;
  justify-content: center;
`;

const ModalHeaderText = styled.Text`
  font-size: 12px;
  text-align: center;
  color: darkgrey;
`;

const ModalButtonText = styled.Text<{ bold?: boolean }>`
  font-size: 16px;
  color: black;
  font-weight: ${({ bold }) => (bold ? "bold" : "normal")};
`;

const ModalButtonBase = css<{ disabled?: boolean }>`
  width: 100%;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  padding: 16px 0px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const ModalButton = styled.TouchableOpacity`
  ${ModalButtonBase};
`;

const ModalCloseButton = styled.TouchableHighlight`
  ${ModalButtonBase};
  background: white;
  color: black;
  border-radius: 12px;
`;

const Divider = styled.View`
  height: 1px;
  width: 100%;
  border-bottom-width: 1px;
  border-bottom-color: lightgrey;
`;

const CloseButtonContainer = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-bottom: 16px;
`;

const modalStyle = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    display: "flex",
    flexDirection: "column",
    marginRight: 8,
    marginLeft: 8,
    marginBottom: 40,
    borderRadius: 12,
  },
});

export {
  ModalContentContainer,
  ModalHeaderTextContainer,
  ModalHeaderText,
  CloseButtonContainer,
  ModalButton,
  ModalCloseButton,
  ModalButtonText,
  Divider,
  modalStyle,
};
