import React from "react";

import Button from "../../atoms/Button";
import Text from "../../atoms/Text";
import { BackgroundBlur } from "../../atoms/BackgroundBlur";
import { Modal } from "../../molecules/Modal";

import {
  ModalContainer,
  DialogContent,
  TextContainer,
  DialogText,
} from "./styled";

interface ApplicantPinPromptModalProps {
  name: string;
  pin: string;
  visible: boolean;
  onClose: () => void;
}
const ApplicantPinPromptModal = ({
  name,
  pin,
  visible,
  onClose,
}: ApplicantPinPromptModalProps): JSX.Element => (
  <Modal
    visible={visible}
    hide={onClose}
    transparent
    presentationStyle="overFullScreen"
    animationType="fade"
    statusBarTranslucent
  >
    <ModalContainer>
      <DialogContent>
        <Text align="center" type="h4">
          Signering behövs av
        </Text>
        <Text align="center" type="h4">
          {name}
        </Text>
        <TextContainer>
          <DialogText>1. {name} loggar in i appen med sitt BankID.</DialogText>
          <DialogText>
            2. Vid inloggning anger {name} koden för att granska och signera.
          </DialogText>
          <DialogText>Kod till {name}:</DialogText>
          <DialogText fontSize={36} fontWeight="bold">
            {pin}
          </DialogText>
        </TextContainer>
        <Button colorSchema="red" fullWidth onClick={onClose}>
          <Text>Okej</Text>
        </Button>
      </DialogContent>
      <BackgroundBlur
        blurType="light"
        blurAmount={15}
        reducedTransparencyFallbackColor="white"
      />
    </ModalContainer>
  </Modal>
);

export default ApplicantPinPromptModal;
