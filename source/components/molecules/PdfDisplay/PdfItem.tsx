import React from "react";
import styled from "styled-components/native";
import type { GestureResponderEvent } from "react-native";
import { TouchableOpacity, Dimensions } from "react-native";
import PdfView from "react-native-pdf";
import { Icon, Button, Text } from "../../atoms";
import { Modal, useModal } from "../Modal";
import type { Pdf } from "./PdfDisplay";

const MAX_PDF_WIDTH = 120;
const MAX_PDF_HEIGHT = 170;

const Flex = styled.View`
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
  margin: 0px 20px 20px 0px;
`;
const DeleteBackground = styled.View`
  position: absolute;
  top: -4px;
  right: -10px;
  padding: 4px;
  elevation: 3;
  background: #eeeeee;
  z-index: 1;
  border-radius: 20px;
`;
const Container = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin: 2px;
  elevation: 2;
  shadow-offset: 0px 2px;
  shadow-color: black;
  shadow-opacity: 0.4;
  shadow-radius: 5px;
  border: 1px solid transparent;
`;

const PdfInModal = styled(PdfView)<{ width: number; height: number }>`
  background-color: white;
  flex: 1;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`;
const ButtonWrapper = styled.View`
  padding-bottom: 40px;
  flex-direction: row;
  justify-content: center;
`;

interface Props {
  pdf: Pdf;
  onRemove: () => void;
}

const PdfItem: React.FC<Props> = ({ pdf, onRemove }) => {
  const [modalVisible, toggleModal] = useModal();

  const handleRemove = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onRemove();
  };

  return (
    <Flex key={pdf.path}>
      <DeleteBackground>
        <TouchableOpacity onPress={handleRemove} activeOpacity={0.1}>
          <Icon name="clear" color="#00213F" />
        </TouchableOpacity>
      </DeleteBackground>

      <Container onPress={toggleModal}>
        <PdfView
          pointerEvents="none"
          source={{ uri: pdf.uri }}
          style={{
            width: MAX_PDF_WIDTH,
            height: MAX_PDF_HEIGHT,
            backgroundColor: "white",
          }}
          singlePage
        />
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
  );
};

export default PdfItem;
