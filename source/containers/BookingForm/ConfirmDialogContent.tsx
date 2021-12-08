import React, { useContext } from "react";
import { ThemeContext } from "styled-components/native";

import Text from "../../components/atoms/Text";

import { ThemeType } from "../../styles/themeHelpers";

import {
  ConfirmDialogButtonContainer,
  ModalTextContainer,
  StyledButton,
} from "./styled";

interface ConfirmDialogProps {
  modalHeader: string;
  modalText: string;
  okButtonText?: string;
  cancelButtonText?: string;
  onOkButtonClick?: () => void;
  onCancelButtonClick?: () => void;
}
const ConfirmDialogContent = (props: ConfirmDialogProps): JSX.Element => {
  const {
    modalHeader,
    modalText,
    okButtonText,
    cancelButtonText,
    onOkButtonClick,
    onCancelButtonClick,
  } = props;

  const { colors } = useContext<ThemeType>(ThemeContext);

  const OkButton = (
    <StyledButton
      colorSchema="red"
      onClick={onOkButtonClick}
      value={okButtonText}
    />
  );

  const CancelButton = (
    <StyledButton
      colorSchema="neutral"
      variant="link"
      onClick={onCancelButtonClick}
      background={colors.neutrals[8]}
    >
      <Text type="text">{cancelButtonText}</Text>
    </StyledButton>
  );
  return (
    <>
      <ModalTextContainer>
        {modalHeader && (
          <Text style={{ paddingBottom: 12, textAlign: "center" }} type="h4">
            {modalHeader}
          </Text>
        )}

        {modalText && (
          <Text style={{ textAlign: "center" }} type="text">
            {modalText}
          </Text>
        )}
      </ModalTextContainer>
      <ConfirmDialogButtonContainer>
        {cancelButtonText && onCancelButtonClick && CancelButton}
        {okButtonText && onOkButtonClick && OkButton}
      </ConfirmDialogButtonContainer>
    </>
  );
};

export default ConfirmDialogContent;
