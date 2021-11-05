import React from "react";
import { View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { DayPicker, TimeSpanButton } from "..";

interface TimeSpan {
  startTime: string;
  endTime: string;
}

interface ValueType {
  date: string;
  timeSpan: TimeSpan;
}

interface TimeSlotPickerProps {
  value: ValueType | undefined;
  onChange: (newObject: Partial<ValueType>) => void;
  availableTimes: Record<string, TimeSpan[]>;
}

const TimeSlotPicker = ({
  value,
  onChange,
  availableTimes,
}: TimeSlotPickerProps): JSX.Element => {
  const dates = Object.keys(availableTimes);
  const currentDate = value?.date || "";
  const currentTimeSpan = value?.timeSpan || {};
  const currentAvailableTimes = availableTimes[currentDate] || [];

  const updateDate = (date: string) => {
    onChange({ date });
  };

  const updateTime = (timeSpan: TimeSpan) => {
    onChange({ ...value, timeSpan });
  };

  const formatTimeSpanText = (timeSpan: TimeSpan) =>
    `${timeSpan.startTime.substr(0, 5)}-${timeSpan.endTime.substr(0, 5)}`;

  const timeSpanIsEqual = (
    t1: TimeSpan | Record<string, never>,
    t2: TimeSpan | Record<string, never>
  ) => {
    if (!t1 || !t2) return false;
    return t1.startTime === t2.startTime && t1.endTime === t2.endTime;
  };

  const renderTimeSpanButton = (timeSpan: TimeSpan) => {
    const selected = timeSpanIsEqual(timeSpan, currentTimeSpan);
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
