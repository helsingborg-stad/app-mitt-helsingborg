import React from "react";
import { TouchableOpacity, Dimensions } from "react-native";
import type { GestureResponderEvent } from "react-native";

import { Icon, Button, Text } from "../../atoms";

import { Modal, useModal } from "../Modal";

import {
  DefaultItem,
  Flex,
  DeleteBackground,
  Container,
  PdfInModal,
  ButtonWrapper,
  MAX_PDF_WIDTH,
} from "./PdfItem.styled";

import type { Props } from "./PdfItem.types";

const PdfItem: React.FC<Props> = ({ pdf, onRemove }) => {
  const [modalVisible, toggleModal] = useModal();

  const handleRemove = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onRemove();
  };

  return (
    <DefaultItem>
      <Flex key={pdf.path}>
        <DeleteBackground>
          <TouchableOpacity onPress={handleRemove} activeOpacity={0.1}>
            <Icon name="clear" color="#00213F" />
          </TouchableOpacity>
        </DeleteBackground>

        <Container disabled>
          <Icon size={32} name="picture-as-pdf" color="#F40F02" />
        </Container>

        <Text align="center" numberOfLines={1} style={{ width: MAX_PDF_WIDTH }}>
          {pdf.displayName}
        </Text>

        <Modal visible={modalVisible} hide={toggleModal}>
          <PdfInModal
            source={{ uri: pdf.uri }}
            width={Dimensions.get("window").width}
            height={Dimensions.get("window").height * 0.89}
          />
          <ButtonWrapper>
            <Button colorSchema="red" onClick={toggleModal}>
              <Text>Stäng</Text>
            </Button>
          </ButtonWrapper>
        </Modal>
      </Flex>
    </DefaultItem>
  );
};

export default PdfItem;
