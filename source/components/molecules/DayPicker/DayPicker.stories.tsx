import { storiesOf } from "@storybook/react-native";
import React, { useState } from "react";
import { View } from "react-native";
import Heading from "../../atoms/Heading";
import DayPicker from "./DayPicker";
import StoryWrapper from "../StoryWrapper";

const storyStartDate = "2018-04-08";

const StoryDayPicker: React.FC<{ startDate: string }> = ({ startDate }) => {
  const [selectedDate, setSelectedDate] = useState("");

  const availableDates = [
    "2018-04-13",
    "2018-04-19",
    "2018-04-28",
    "2018-05-03",
    "2018-05-18",
    "2018-05-20",
    "2018-06-17",
    "2018-06-30",
    "2018-07-04",
  ];

  const callback = (dateString) => setSelectedDate(dateString);

  return (
    <View>
      <View style={{ padding: 20 }}>
        <Heading type="h1">Selected date: {selectedDate || "None"}</Heading>
      </View>
      <DayPicker
        startDate={startDate}
        availableDates={availableDates}
        selectedDate={selectedDate}
        onDateSelected={callback}
      />
    </View>
  );
};

storiesOf("Date picker", module).add("Predetermined date", () => (
  <StoryWrapper>
    <StoryDayPicker startDate={storyStartDate} />
  </StoryWrapper>
));

storiesOf("Date picker", module).add("Today", () => (
  <StoryWrapper>
    <StoryDayPicker startDate={undefined} />
  </StoryWrapper>
));
