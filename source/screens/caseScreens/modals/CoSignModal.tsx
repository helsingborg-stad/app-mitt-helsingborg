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
} from "./styled";

interface ConfirmModalProps {
  firstName: string;
  visible: boolean;
  onCloseModal: () => void;
}
const CoSignModal = ({
  firstName,
  visible,
  onCloseModal,
}: ConfirmModalProps): JSX.Element => (
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
        <Heading type="h4">Bekräftelse behövs</Heading>
        <Text align="center">
          {"\n"}För att kunna starta ansökan måste {firstName} bekräfta att ni
          söker tillsammans.
          {"\n\n"}Bekräfta så här:{"\n\n"}
          1. {firstName} installerar Mitt Helsingborg på sin telefon.{"\n"}
          2. {firstName} loggar in med sitt BankID i appen.
          {"\n"}
          3. När {firstName} har loggat in är bekräftelse gjord och det går att
          starta ansökan.{"\n"}
        </Text>
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

export default CoSignModal;
