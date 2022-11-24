import styled from "styled-components/native";

import { Button, Icon, Text } from "../../atoms";

import type { ThemeType, PrimaryColor } from "../../../theme/themeHelpers";

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Box = styled.View<{ theme: ThemeType }>`
  width: 70%;
  height: auto;
  z-index: 1000;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: ${(props) => props.theme.colors.neutrals[5]};
  padding: 12px;
  elevation: 2;
  shadow-offset: 0px 2px;
  shadow-color: black;
  shadow-opacity: 0.3;
  shadow-radius: 2px;
`;

const AuthActivityIndicator = styled.ActivityIndicator`
  margin-top: 12px;
  margin-bottom: 24px;
`;

const InfoText = styled(Text)`
  font-size: ${(props) => props.theme.fontSizes[3]}px;
  margin-bottom: 24px;
  text-align: center;
  color: ${(props) => props.theme.colors.neutrals[1]};
  font-weight: ${(props) => props.theme.fontWeights[1]};
`;

const AbortButton = styled(Button)`
  background: #e5e5e5;
`;

const ButtonText = styled(Text)`
  color: ${(props) => props.theme.colors.neutrals[1]};
  font-weight: ${(props) => props.theme.fontWeights[1]};
`;

const SuccessIcon = styled(Icon)<{
  theme: ThemeType;
  colorSchema: PrimaryColor;
}>`
  color: ${({ theme, colorSchema }) => theme.colors.primary[colorSchema][0]};
`;

export {
  Container,
  Box,
  AuthActivityIndicator,
  InfoText,
  AbortButton,
  ButtonText,
  SuccessIcon,
};
