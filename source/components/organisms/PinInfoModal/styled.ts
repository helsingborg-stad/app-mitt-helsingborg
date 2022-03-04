import styled from "styled-components/native";

const ModalContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const DialogContent = styled.View`
  width: 80%;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background: ${(props) => props.theme.colors.neutrals[5]};
  padding: 24px;
  align-items: center;
`;

interface DialogTextProps {
  fontSize?: number;
  fontWeight?: string;
}
const DialogText = styled.Text<DialogTextProps>`
  font-size: ${({ fontSize = 16 }) => `${fontSize}px`};
  font-weight: ${({ fontWeight = "normal" }) => fontWeight};
  text-align: center;
  padding-bottom: 12px;
`;

const TextContainer = styled.View`
  display: flex;
  padding: 12px 0;
`;

export { ModalContainer, DialogContent, DialogText, TextContainer };
