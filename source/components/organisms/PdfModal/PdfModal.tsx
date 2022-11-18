import React from "react";
import { Dimensions } from "react-native";

import { Button, Text } from "../../atoms";

import { Modal } from "../../molecules";

import { PdfInModal, ButtonWrapper } from "./PdfModal.styled";

import type { Props } from "./PdfModal.types";

const PdfModal: React.FC<Props> = ({ uri, isVisible, toggleModal }: Props) => (
  <Modal visible={isVisible} hide={toggleModal}>
    <PdfInModal
      source={{ uri }}
      width={Dimensions.get("window").width}
      height={Dimensions.get("window").height * 0.89}
    />
    <ButtonWrapper>
      <Button colorSchema="red" onClick={toggleModal}>
        <Text>Stäng</Text>
      </Button>
    </ButtonWrapper>
  </Modal>
);

export default PdfModal;
