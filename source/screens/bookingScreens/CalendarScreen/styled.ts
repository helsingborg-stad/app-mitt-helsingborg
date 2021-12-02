import styled from "styled-components/native";
import { Heading, Text } from "../../../components/atoms";

const Container = styled.ScrollView`
  flex: 1;
  padding-left: 16px;
  padding-right: 16px;
`;

const ListHeading = styled(Heading)`
  margin-left: 4px;
  margin-top: 24px;
  margin-bottom: 8px;
`;

const ScrollViewSpacer = styled.View`
  height: 60px;
`;

const SmallCard = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const SmallDate = styled.View`
  flex: 1;
  padding-right: 10px;
  max-width: 50px;
`;

const CardContainer = styled.View`
  flex: 7;
`;

const DateText = styled(Text)`
  color: ${(props) => props.theme.colors.primary.red[1]};
`;

export {
  Container,
  ListHeading,
  ScrollViewSpacer,
  SmallCard,
  SmallDate,
  CardContainer,
  DateText,
};
