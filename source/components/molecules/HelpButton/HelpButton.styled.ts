import styled from "styled-components/native";
import Markdown from "react-native-markdown-display";

import Button from "../../atoms/Button";
import Text from "../../atoms/Text";

import BackNavigation from "../BackNavigation/BackNavigation";

const ModalContainer = styled.View({
  flexGrow: 1,
});

const Container = styled.View`
  padding: 24px;
  flex: 1;
`;

const StyledScrollView = styled.ScrollView`
  padding-bottom: 24px;
  padding-top: 84px;
  margin-bottom: 24px;
`;
const CloseModal = styled(BackNavigation)`
  padding: 26px;
  position: absolute;
`;

const Tagline = styled(Text)`
  font-size: 14px;
  font-weight: bold;
  line-height: 20px;
  text-transform: uppercase;
`;

const Heading = styled(Text)`
  margin-top: 15px;
  font-size: 30px;
  font-weight: bold;
  line-height: 40px;
`;

const HelpText = styled(Markdown)`
  margin-top: 20px;
  font-size: 16px;
  font-weight: bold;
  line-height: 25px;
  padding-bottom: 84px;
`;

const LinkButton = styled(Button)`
  margin-top: 20px;
`;

export {
  ModalContainer,
  Container,
  StyledScrollView,
  CloseModal,
  Tagline,
  Heading,
  HelpText,
  LinkButton,
};
