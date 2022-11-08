import styled from "styled-components/native";
import PdfView from "react-native-pdf";

const MAX_PDF_WIDTH = 120;
const MAX_PDF_HEIGHT = 170;

const DefaultItem = styled.View`
  padding-top: 6px;
`;

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
  height: ${MAX_PDF_HEIGHT}px;
  width: ${MAX_PDF_WIDTH}px;
  background: #fff;
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

export {
  DefaultItem,
  Flex,
  DeleteBackground,
  Container,
  PdfInModal,
  ButtonWrapper,
  MAX_PDF_WIDTH,
};
