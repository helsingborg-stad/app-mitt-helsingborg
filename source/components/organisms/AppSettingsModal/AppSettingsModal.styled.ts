import { View } from "react-native";
import styled from "styled-components/native";
import { Button, Heading, Text } from "../../atoms";

import { Modal as ModalBase, BackNavigation } from "../../molecules";

const UnifiedPadding = [24, 48];

export const Body = styled.View`
  padding: ${UnifiedPadding[0]}px ${UnifiedPadding[1]}px ${UnifiedPadding[0]}px
    ${UnifiedPadding[1]}px;
`;

export const Modal = styled(ModalBase)`
  background-color: ${(props) => props.theme.colors.neutrals[6]};
`;

export const TitleText = styled(Heading)`
  font-size: ${({ theme }) => theme.fontSizes[3]}px;
  color: ${({ theme }) => theme.colors.primary.red[0]};
  font-weight: ${({ theme }) => theme.fontWeights[1]};
`;

export const HeadingText = styled(Heading)`
  font-size: ${({ theme }) => theme.fontSizes[2]}px;
  font-weight: ${({ theme }) => theme.fontWeights[1]};
  line-height: 44px;
  color: ${({ theme }) => theme.colors.neutrals[0]};
`;

export const ErrorText = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes[1]}px;
  color: ${({ theme }) => theme.colors.primary.red[3]};
  text-align: center;
  margin: 5px 0px;
`;

export const ResetButton = styled(Button)`
  width: 300px;
  margin: 10px 0px 0px 0px;
`;

export const CloseModalButton = styled(BackNavigation)`
  padding: 24px;
`;

export const SpinnerContainer = styled(View)`
  background-color: white;
  opacity: 0.5;
  padding: 20px;
  position: absolute;
  top: 0px;
  right: 0px;
  left: 0px;
  bottom: 0px;
`;
