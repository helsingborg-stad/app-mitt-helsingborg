import styled from "styled-components/native";
import { Text } from "../../../components/atoms";

const Container = styled.ScrollView`
  height: 80%;
  margin-top: 0px;
  padding-top: 0px;
  padding-left: 16px;
  padding-right: 16px;
  background-color: ${({ theme }) => theme.colors.neutrals[6]};
`;

const TitleWrapper = styled.View`
  margin-bottom: 15px;
`;

const Title = styled(Text)`
  margin: 15px 0px;
`;

export { Container, TitleWrapper, Title };
