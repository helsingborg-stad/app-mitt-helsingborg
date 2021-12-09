import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styled from "styled-components/native";
import { Text } from "../../components/atoms";

const Scroller = styled(KeyboardAwareScrollView)`
  flex: 1;
`;

const ListWrapper = styled.View`
  margin: 24px 15px;
`;

const CharacterCardWrapper = styled.View`
  margin-bottom: 15px;
`;

const Spacer = styled.View`
  height: 15px;
`;

const SpacedView = styled.View`
  margin-bottom: 15px;
`;

const ButtonPanel = styled.View`
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  height: 120px;
  background-color: ${(props) => props.theme.colors.neutrals[5]};
  shadow-offset: 0px -1px;
  shadow-color: ${(props) => props.theme.colors.neutrals[1]};
  shadow-opacity: 0.3;
  shadow-radius: 2px;
  elevation: 2;
  z-index: 1000;
  justify-content: center;
  align-content: center;
`;

const ButtonContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 20px 15px 48px 15px;
`;

const ButtonText = styled(Text)<{ color: string }>`
  font-size: ${({ theme }) => theme.fontSizes[1]}px;
  color: ${({ color }) => color};
`;

export {
  Scroller,
  ListWrapper,
  CharacterCardWrapper,
  Spacer,
  SpacedView,
  ButtonContainer,
  ButtonText,
  ButtonPanel,
};
