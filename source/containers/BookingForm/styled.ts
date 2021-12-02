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

const ButtonContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const SubmitSection = styled.View`
  flex: 1;
`;

const DeleteSection = styled.View<{ withMargin: boolean }>`
  ${({ withMargin }) => withMargin && `margin-right: 20px;`}
  flex: 1;
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
  DeleteSection,
  SubmitSection,
  ButtonText,
};
