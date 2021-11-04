import React from "react";
import { storiesOf } from "@storybook/react-native";
import styled from "styled-components/native";
import { Text } from "../../atoms";
import StoryWrapper from "../StoryWrapper";
import AddressCard from "./AddressCard";

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

const AddressCardStory = () => (
  <FlexContainer>
    <Title>No geocode</Title>
    <AddressCard addressLines={["Kontaktcenter", "Stortorget 17"]} />
    <Title>With geocode</Title>
    <AddressCard
      addressLines={["Kontaktcenter", "Stortorget 17"]}
      geocode="geo:56.0474178,12.6959072"
    />
  </FlexContainer>
);

storiesOf("Address Card", module).add("Default", () => (
  <StoryWrapper>
    <AddressCardStory />
  </StoryWrapper>
));
