import React from "react";
import { storiesOf } from "@storybook/react-native";
import styled from "styled-components/native";

import StoryWrapper from "../../molecules/StoryWrapper";

import TextButton from "./TextButton";

const Container = styled.View`
  width: 100%;
  height: 100%;
`;

storiesOf("TextButton", module)
  .add("Default", () => (
    <StoryWrapper>
      <Container>
        <TextButton label="My button" onPress={() => true} />
      </Container>
    </StoryWrapper>
  ))
  .add("Disabled", () => (
    <StoryWrapper>
      <Container>
        <TextButton label="My disabled button" onPress={() => true} disabled />
      </Container>
    </StoryWrapper>
  ));
