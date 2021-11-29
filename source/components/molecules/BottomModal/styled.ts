import styled from "styled-components/native";

const ModalContentContainer = styled.View`
  width: 100%;
  border-top-right-radius: 9px;
  border-top-left-radius: 9px;
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
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: ${({ background }) => background};
  border-bottom-color: #eee;
  border-bottom-width: 1px;
  margin-bottom: 16px;
  border-top-right-radius: 9px;
  border-top-left-radius: 9px;
  padding: 0px;
`;

const HandleBar = styled.View`
  background-color: #3d3d3d;
  width: 32px;
  height: 5px;
  margin-top: 8px;
  margin-bottom: 0px;
  border-radius: 55px;
`;

const InnerNavigatorContainer = styled.View<ModalTopContainerProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  width: 100%;
  background: ${({ background }) => background};
  padding: 0 20px;
  border-top-right-radius: 9px;
  border-top-left-radius: 9px;
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

export {
  ModalContentContainer,
  NavigatorContainer,
  InnerNavigatorContainer,
  IconContainer,
  ModalText,
  HandleBar,
};
