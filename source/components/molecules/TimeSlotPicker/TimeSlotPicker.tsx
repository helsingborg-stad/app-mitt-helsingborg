import React from "react";
import { View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import moment from "moment";
import { DayPicker, TimeSpanButton } from "..";
import { TimeSlot } from "../../../types/BookingTypes";

interface TimeSlotPickerProps {
  value: TimeSlot | undefined;
  onChange: (newObject: TimeSlot | undefined) => void;
  availableTimes: Record<string, TimeSlot[]>;
}

const TimeSlotPicker = ({
  value,
  onChange,
  availableTimes,
}: TimeSlotPickerProps): JSX.Element => {
  const dates = Object.keys(availableTimes);
  const currentDate = value?.date || "";
  const currentAvailableTimes = availableTimes[currentDate] || [];

  const updateDate = (date: string) => {
    onChange({ date });
  };

  const updateTime = (timeSpan: TimeSlot) => {
    onChange(timeSpan);
  };

  const formatTimeSpanText = (timeSpan: TimeSlot) =>
    `${moment(`${timeSpan.date} ${timeSpan.startTime}`).format("HH:mm")} - ` +
    `${moment(`${timeSpan.date} ${timeSpan.endTime}`).format("HH:mm")}`;

  const timeSpanIsEqual = (
    t1: TimeSlot | Record<string, never> | undefined,
    t2: TimeSlot | Record<string, never> | undefined
  ) => {
    if (!t1 || !t2 || t1 === {} || t2 === {}) return false;
    return t1.startTime === t2.startTime && t1.endTime === t2.endTime;
  };

  const renderTimeSpanButton = (timeSpan: TimeSlot) => {
    const selected = timeSpanIsEqual(timeSpan, value);
    const formattedText = formatTimeSpanText(timeSpan);
    const textColor = selected ? "white" : "black";
    const keyString = `TimeSpanButton-${currentDate}-${timeSpan.startTime}`;
    return (
      <TimeSpanButton
        key={keyString}
        onClick={() => updateTime(timeSpan)}
        selected={selected}
      >
        <Text
          style={{
            color: textColor,
          }}
        >
          {formattedText}
        </Text>
      </TimeSpanButton>
    );
  };

  return (
    <View>
      <DayPicker
        selectedDate={currentDate}
        availableDates={dates}
        onDateSelected={updateDate}
      />
      <ScrollView
        horizontal
        contentContainerStyle={{
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        {currentAvailableTimes.map(renderTimeSpanButton)}
      </ScrollView>
    </View>
  );
};

export default TimeSlotPicker;
