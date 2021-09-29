import { storiesOf } from "@storybook/react-native";
import React, { useState } from "react";
import { View } from "react-native";
import moment from "moment";
import { H1 } from "../../atoms/Heading/Heading";
import DayPicker from "./DayPicker";
import StoryWrapper from "../StoryWrapper";

const StoryDayPicker = () => {
  const [selectedDate, setSelectedDate] = useState("None");

  const startDate = moment("2018-04-08").toDate();
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
        <H1>Selected date: {selectedDate}</H1>
      </View>
      <DayPicker
        startDate={startDate}
        availableDates={availableDates}
        onDateSelected={(dateString) => callback(dateString)}
      />
    </View>
  );
};

storiesOf("Date picker", module).add("Default", () => (
  <StoryWrapper>
    <StoryDayPicker />
  </StoryWrapper>
));
