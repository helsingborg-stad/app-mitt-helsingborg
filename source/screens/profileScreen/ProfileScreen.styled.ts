import styled from "styled-components/native";

import { ScreenWrapper } from "../../components/molecules";
import { Button, Text, Heading, Label } from "../../components/atoms";

const ProfileScreenWrapper = styled(ScreenWrapper)`
  padding: 0;
`;

const Container = styled.ScrollView`
  flex: 1;
  padding: 0px 16px;
`;

const BottomContainer = styled.View`
  margin-top: 32px;
  margin-bottom: 16px;
  flex: 1;
  justify-content: flex-end;
  padding-bottom: 16px;
`;

const MarginButton = styled(Button)`
  margin-top: 8px;
  margin-bottom: 8px;
`;

const ProfileInfoContainer = styled.View`
  margin: 16px 0px;
`;

const ProfileInfoHeading = styled(Heading)`
  color: ${(props) => props.theme.text.darkest};
  margin-top: 16px;
  margin-bottom: 0px;
`;

const ProfileInfoText = styled(Text)`
  font-size: 16px;
  color: ${(props) => props.theme.text.darkest};
  font-weight: normal;
`;

const ProfileLabel = styled(Label)`
  font-size: 12px;
  margin-top: 16px;
  margin-bottom: 0px;
  font-weight: ${(props) => props.theme.fontWeights[1]};
  color: ${(props) => props.theme.text.blue[4]};
`;

export {
  ProfileScreenWrapper,
  Container,
  BottomContainer,
  MarginButton,
  ProfileInfoContainer,
  ProfileInfoHeading,
  ProfileInfoText,
  ProfileLabel,
};
