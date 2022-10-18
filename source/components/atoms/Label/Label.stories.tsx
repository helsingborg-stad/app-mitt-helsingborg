import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";
import FieldLabel from "./Label";
import StoryWrapper from "../../molecules/StoryWrapper";
import theme from "../../../theme/theme";

const Background = styled.View`
  background-color: ${theme.background.darker};
`;

storiesOf("Field Label", module).add("default", () => (
  <StoryWrapper>
    <FieldLabel size="small" help={{ text: "Some help text" }}>
      Small light label
    </FieldLabel>
    <FieldLabel
      size="small"
      underline={false}
      help={{ text: "Some help text" }}
    >
      Small label without line
    </FieldLabel>
    <FieldLabel colorSchema="green">Normal green underline</FieldLabel>
    <FieldLabel size="large" help={{ text: "Some help text" }}>
      Large label blue underline
    </FieldLabel>
    <Background>
      <FieldLabel>Normal blue Label</FieldLabel>
      <FieldLabel size="large" help={{ text: "Some help text" }}>
        Large dark label
      </FieldLabel>
    </Background>
  </StoryWrapper>
));
