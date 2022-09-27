import { View, TouchableHighlight } from "react-native";
import styled from "styled-components";

import Text from "../../atoms/Text/Text";

export const TouchableWrapper = styled(TouchableHighlight)`
  border-radius: 4px;
  padding: 2px;
`;
export const Row = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: 3px;
  margin-top: 3px;
`;
export const ButtonWrapper = styled(View)`
  flex: 1;
`;
export const TextWrapper = styled(View)<{ size: "small" | "medium" | "large" }>`
  flex: 10;
  margin-left: ${(props) =>
    props.theme.radiobuttonGroup[props.size].textMargin}px;
`;
export const ErrorText = styled(Text)`
  text-align: center;
  padding-top: 16px;
  color: ${({ theme }: { theme: ThemeType }) => theme.colors.primary.red[1]};
`;
