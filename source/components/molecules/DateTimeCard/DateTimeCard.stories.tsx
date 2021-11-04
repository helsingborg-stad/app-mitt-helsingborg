import React from "react";
import { storiesOf } from "@storybook/react-native";
import styled from "styled-components/native";
import { Text } from "../../atoms";
import StoryWrapper from "../StoryWrapper";
import DateTimeCard from "./DateTimeCard";

const FlexContainer = styled.ScrollView`
  background-color: #fff;
  padding: 16px;
`;

const Title = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 6px;
`;

const DateTimeCardStory = () => (
  <FlexContainer>
    <Title>Default</Title>
    <DateTimeCard date="Fredag 4 juni" time="11:15 - 12:00" />
  </FlexContainer>
);

storiesOf("Date Time Card", module).add("Default", () => (
  <StoryWrapper>
    <DateTimeCardStory />
  </StoryWrapper>
));
