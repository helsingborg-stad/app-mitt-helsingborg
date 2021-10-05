import styled from "styled-components/native";

const ModalContentContainer = styled.View`
  width: 100%;
  border-radius: 4.5px;
  min-height: 40%;
  background: white;
  display: flex;
  flex-direction: column;
`;

interface ModalTopContainerProps {
  background: string;
}
const NavigatorContainer = styled.View<ModalTopContainerProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background: ${({ background }) => background};
  border-bottom-color: #eee;
  border-bottom-width: 1px;
  padding: 0 30px;
  margin-bottom: 16px;
`;

interface IconContainerProps {
  flexDirection: string;
}
const IconContainer = styled.View<IconContainerProps>`
  width: 20%;
  display: flex;
  flex-direction: row;
  justify-content: ${({ flexDirection }) => flexDirection};
`;

interface ModalTextProps {
  size: number;
  color: string;
}
const ModalText = styled.Text<ModalTextProps>`
  font-size: ${({ size }) => `${size}px`};
  font-weight: 600;
  color: ${({ color }) => color};
`;

export { ModalContentContainer, NavigatorContainer, IconContainer, ModalText };
