import React from "react";

import Heading from "../../../components/atoms/Heading";
import Text from "../../../components/atoms/Text";

import BackgroundBlur from "../../../components/molecules/Dialog/BackgroundBlur";
import { Modal } from "../../../components/molecules/Modal";

import {
  Wrapper,
  DialogContainer,
  ButtonContainer,
  PopupButton,
  StyledText,
} from "./styled";

interface ConfirmationThanksModalProps {
  firstName: string;
  visible: boolean;
  onCloseModal: () => void;
}
const ConfirmationThanksModal = ({
  visible,
  firstName,
  onCloseModal,
}: ConfirmationThanksModalProps): JSX.Element => (
  <Modal
    visible={visible}
    hide={onCloseModal}
    transparent
    presentationStyle="overFullScreen"
    animationType="fade"
    statusBarTranslucent
  >
    <Wrapper>
      <DialogContainer>
        <Heading type="h4">Tack, för din bekräftelse!</Heading>
        <StyledText align="center">
          Genom att logga in har du bekräftat att du och {firstName} söker
          ekonomiskt bistånd tillsammans.
        </StyledText>
        <Text align="center">{firstName} kan nu starta ansökan.</Text>
        <ButtonContainer>
          <PopupButton onClick={onCloseModal} block colorSchema="red">
            <Text>Okej</Text>
          </PopupButton>
        </ButtonContainer>
      </DialogContainer>
      <BackgroundBlur
        blurType="light"
        blurAmount={15}
        reducedTransparencyFallbackColor="white"
      />
    </Wrapper>
  </Modal>
);

export default ConfirmationThanksModal;
