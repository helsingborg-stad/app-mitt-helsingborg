import React from "react";
import { View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import stringify from "json-stable-stringify";
import { DayPicker, TimeSpanButton } from "..";

interface TimeSlotPickerProps {
  value: any;
  onChange: (newObject: any) => void;
  availableTimes: any;
}

const TimeSlotPicker = ({
  value,
  onChange,
  availableTimes,
}: TimeSlotPickerProps): JSX.Element => {
  const dates = Object.keys(availableTimes);

  const currentDate = value && value.date ? value.date : "";
  const timeObject = value && value.times ? value.times : [];

  const currentTimes = currentDate ? availableTimes[currentDate] : [];

  const updateDate = (date: string) => {
    onChange({ date });
  };

  const updateTime = (times: any) => {
    onChange({ ...value, times });
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
        {currentTimes.map((times: any) => {
          const selected = stringify(times) === stringify(timeObject);
          const formattedText =
            `${times.startTime.substr(0, 5)}-` +
            `${times.endTime.substr(0, 5)}`;
          return (
            <TimeSpanButton
              key={`TimeSpanButton-${times.startTime}-${times.endTime}`}
              onClick={() => updateTime(times)}
              selected={selected}
            >
              <Text
                style={{
                  color: selected ? "white" : "black",
                }}
              >
                {formattedText}
              </Text>
            </TimeSpanButton>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default TimeSlotPicker;
