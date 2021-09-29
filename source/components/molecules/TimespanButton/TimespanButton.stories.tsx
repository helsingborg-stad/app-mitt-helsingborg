import React from "react";
import { storiesOf } from "@storybook/react-native";
import StoryWrapper from "../StoryWrapper";
import TimeSpanButton from "./TimeSpanButton";

storiesOf("TimeSpanButton", module).add("default", () => (
  <StoryWrapper>
    <TimeSpanButton
      startTime="12:00"
      endTime="13:00"
      onClick={() => {
        console.log("CLICK");
      }}
      selected={false}
    />
    <TimeSpanButton
      startTime="12:00"
      endTime="13:00"
      onClick={() => {
        console.log("CLICK");
      }}
      selected
    />
  </StoryWrapper>
));
