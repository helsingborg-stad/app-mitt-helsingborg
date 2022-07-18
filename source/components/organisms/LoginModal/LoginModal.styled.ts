import styled from "styled-components/native";

import { Modal as ModalBase, BackNavigation } from "../../molecules";

import { Heading, Input, Text } from "../../atoms";

import type { ThemeType } from "../../../styles/themeHelpers";

const UnifiedPadding = [24, 48];

const FlexView = styled.View`
  flex: 1;
`;

const Header = styled.View`
  flex: 4;
  padding: ${UnifiedPadding[1]}px ${UnifiedPadding[1]}px 0px
    ${UnifiedPadding[1]}px;
`;

const Form = styled.View`
  padding: 0px ${UnifiedPadding[1]}px ${UnifiedPadding[0]}px
    ${UnifiedPadding[1]}px;
  justify-content: center;
  align-items: center;
`;

const Title = styled(Heading)`
  font-size: ${({ theme }) => theme.fontSizes[3]}px;
  color: ${({ theme }) => theme.colors.primary.red[0]};
  font-weight: ${({ theme }) => theme.fontWeights[1]};
`;

const ModalHeading = styled(Heading)`
  font-size: ${({ theme }) => theme.fontSizes[9]}px;
  font-weight: ${({ theme }) => theme.fontWeights[1]};
  line-height: 44px;
  color: ${({ theme }) => theme.colors.neutrals[0]};
`;

const ContentText = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes[4]}px;
  line-height: 30px;
`;

interface SeparatorProps {
  theme: ThemeType;
}
const Separator = styled.View<SeparatorProps>`
  border-radius: 40px;
  height: 2px;
  width: 25px;
  background-color: ${({ theme }) => theme.colors.complementary.red[0]};
  margin-bottom: 16px;
`;

const Modal = styled(ModalBase)`
  background-color: ${({ theme }) => theme.colors.neutrals[6]};
`;

const Link = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes[3]}px;
  text-align: center;
  margin-top: 16px;
  font-weight: normal;
`;

const LoginInput = styled(Input)`
  margin: 0px;
  margin-bottom: 32px;
`;

const Label = styled(Text)`
  text-align: center;
  margin-bottom: 8px;
`;

const CloseModalButton = styled(BackNavigation)`
  padding: 24px;
`;

export {
  CloseModalButton,
  ContentText,
  FlexView,
  Form,
  Header,
  Label,
  Link,
  LoginInput,
  Modal,
  ModalHeading,
  Separator,
  Title,
};
