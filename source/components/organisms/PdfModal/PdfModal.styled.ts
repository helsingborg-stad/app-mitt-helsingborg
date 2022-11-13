import styled from "styled-components/native";
import PdfView from "react-native-pdf";

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

export { PdfInModal, ButtonWrapper };
