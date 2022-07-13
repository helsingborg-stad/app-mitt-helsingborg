import styled from "styled-components/native";
import Heading from "../../components/atoms/Heading";
import Input from "../../components/atoms/Input";
import Text from "../../components/atoms/Text";
import BackNavigation from "../../components/molecules/BackNavigation";
import { Modal as ModalBase } from "../../components/molecules/Modal";

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
  font-size: ${(props) => props.theme.fontSizes[3]}px;
  color: ${(props) => props.theme.colors.primary.red[0]};
  font-weight: ${(props) => props.theme.fontWeights[1]};
`;

const ModalHeading = styled(Heading)`
  font-size: ${(props) => props.theme.fontSizes[9]}px;
  font-weight: ${(props) => props.theme.fontWeights[1]};
  line-height: 44px;
  color: ${(props) => props.theme.colors.neutrals[0]};
`;

const ContentText = styled(Text)`
  font-size: ${(props) => props.theme.fontSizes[4]}px;
  line-height: 30px;
`;

const Separator = styled.View`
  border-radius: 40px;
  height: 2px;
  width: 25px;
  background-color: ${(props) => props.theme.colors.complementary.red[0]};
  margin-bottom: 16px;
`;

const Modal = styled(ModalBase)`
  background-color: ${(props) => props.theme.colors.neutrals[6]};
`;

const Link = styled(Text)`
  font-size: ${(props) => props.theme.fontSizes[3]}px;
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
