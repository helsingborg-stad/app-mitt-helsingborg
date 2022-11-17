import styled from "styled-components/native";

const MAX_IMAGE_WIDTH = 120;
const MAX_IMAGE_HEIGHT = 170;

const ModalView = styled.View`
  flex: 1;
`;

const DefaultItem = styled.TouchableOpacity`
  margin-bottom: 20px;
  margin-right: 20px;
  padding-top: 6px;
`;

const Flex = styled.View`
  flex-direction: column;
  align-items: center;
  padding: 0;
  padding-top: 10px;
`;

const DeleteBackground = styled.View`
  position: absolute;
  top: -4px;
  right: -12px;
  padding: 4px;
  elevation: 3;
  background: #eeeeee;
  z-index: 1;
  border-radius: 20px;
`;

const ButtonWrapper = styled.View`
  flex-direction: row;
  margin-bottom: 40px;
  justify-content: center;
`;

const IconContainer = styled.View`
  margin: 2px;
  elevation: 2;
  shadow-offset: 0px 2px;
  shadow-color: black;
  shadow-opacity: 0.4;
  shadow-radius: 5px;
  border: 1px solid transparent;
`;

const ImageIcon = styled.Image`
  width: ${MAX_IMAGE_WIDTH}px;
  height: ${MAX_IMAGE_HEIGHT}px;
`;

const ActivityWrapper = styled.View`
  width: ${MAX_IMAGE_WIDTH}px;
  height: ${MAX_IMAGE_HEIGHT}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ActivityWrapperModal = styled.View<{ width: number; height: number }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ActivityIndicator = styled.ActivityIndicator`
  margin-top: 12px;
  margin-bottom: 24px;
`;

export {
  ModalView,
  DefaultItem,
  Flex,
  DeleteBackground,
  ButtonWrapper,
  IconContainer,
  ImageIcon,
  ActivityWrapper,
  ActivityWrapperModal,
  ActivityIndicator,
  MAX_IMAGE_WIDTH,
};
