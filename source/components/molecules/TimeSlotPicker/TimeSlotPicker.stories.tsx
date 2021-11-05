import React, { useState } from "react";
import { storiesOf } from "@storybook/react-native";
import moment from "moment";
import StoryWrapper from "../StoryWrapper";
import TimeSlotPicker from "./TimeSlotPicker";

const mockAvailableTimes = {
  [moment().add(2, "days").format("yyyy-MM-DD")]: [
    {
      startTime: "09:00:00",
      endTime: "10:00:00",
    },
    {
      startTime: "10:15:00",
      endTime: "11:15:00",
    },
  ],
  [moment().add(7, "days").format("yyyy-MM-DD")]: [
    {
      startTime: "09:15:00",
      endTime: "10:15:00",
    },
    {
      startTime: "13:00:00",
      endTime: "14:00:00",
    },
    {
      startTime: "14:15:00",
      endTime: "15:15:00",
    },
    {
      startTime: "15:30:00",
      endTime: "16:30:00",
    },
  ],
  [moment().add(1, "months").format("yyyy-MM-DD")]: [
    {
      startTime: "08:00:00",
      endTime: "09:00:00",
    },
    {
      startTime: "14:15:00",
      endTime: "15:15:00",
    },
  ],
};

const TimeSlotPickerStory = () => {
  const [value, setValue] = useState(undefined);

  return (
    <TimeSlotPicker
      value={value}
      availableTimes={mockAvailableTimes}
      onChange={setValue}
    />
  );
};

storiesOf("Time Slot Picker", module).add("Default", (storyContext) => (
  <StoryWrapper kind={storyContext?.kind} name={storyContext?.name}>
    <TimeSlotPickerStory />
  </StoryWrapper>
));
