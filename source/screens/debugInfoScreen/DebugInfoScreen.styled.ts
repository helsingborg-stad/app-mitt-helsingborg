import styled from "styled-components/native";
import { Button } from "../../components/atoms";
import { ScreenWrapper } from "../../components/molecules";

export const DebugInfoScreenWrapper = styled(ScreenWrapper)`
  padding: 0;
`;

export const MarginedText = styled.Text`
  margin-top: 8px;
  margin-bottom: 8px;
`;

export const Container = styled.ScrollView`
  flex: 1;
  margin: 16px 16px 40px 16px;
`;

export const MarginButton = styled(Button)`
  margin-top: 8px;
  margin-bottom: 8px;
`;
