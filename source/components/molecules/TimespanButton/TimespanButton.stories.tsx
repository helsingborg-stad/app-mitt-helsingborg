import React from "react";
import { Text } from "react-native";
import { storiesOf } from "@storybook/react-native";
import StoryWrapper from "../StoryWrapper";
import TimeSpanButton from "./TimeSpanButton";

const dummyCallback = () => true;
const timeSpan = "12:00 - 13:00";

storiesOf("TimeSpanButton", module).add("Overview examples", () => (
  <StoryWrapper>
    <Text>Normalt utförande</Text>
    <TimeSpanButton onClick={dummyCallback} selected={false}>
      {timeSpan}
    </TimeSpanButton>

    <Text>Valt utförande</Text>
    <TimeSpanButton onClick={dummyCallback} selected>
      {timeSpan}
    </TimeSpanButton>
  </StoryWrapper>
));
