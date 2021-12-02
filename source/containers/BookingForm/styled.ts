import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styled from "styled-components/native";

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

export { Scroller, ListWrapper, CharacterCardWrapper, Spacer, SpacedView };
