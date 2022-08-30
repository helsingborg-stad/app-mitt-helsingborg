import styled from "styled-components/native";

import { Text } from "../../components/atoms";

const Container = styled.ScrollView`
  flex: 1;
  padding-left: 16px;
  padding-right: 16px;
`;

const SummaryHeading = styled(Text)`
  margin-left: 4px;
  margin-top: 30px;
  margin-bottom: 16px;
`;

const RemoveCaseButtonContainer = styled.View`
  padding: 16px;
`;

export { Container, SummaryHeading, RemoveCaseButtonContainer };
