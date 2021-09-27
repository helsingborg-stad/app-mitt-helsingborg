import React, { useState } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";
import moment from "moment";
import localeConfig from "./localeConfig";
import { dayStyles, calendarTheme } from "./styles";

LocaleConfig.locales.se = localeConfig;
LocaleConfig.defaultLocale = "se";

type DayPickerProps = {
  availableDates: string[];
  onDateSelected: (dateString: string) => void;
  startDate?: Date;
};

const DayPicker: React.FC<DayPickerProps> = ({
  availableDates,
  onDateSelected,
  startDate,
}) => {
  const [selectedDate, setSelectedDate] = useState();

  const minDate = startDate;
  const maxDate = moment(minDate).add(3, "M").toDate(); // Placeholder value of 3 months forward, must be discussed further
  const markedDates = {};
  const minDateString = moment(minDate).format("yyyy-MM-DD");
  markedDates[minDateString] = {
    customStyles: dayStyles.todayStyle,
  };
  availableDates.forEach((date) => {
    const isSelected = date === selectedDate;
    markedDates[date] = {
      selected: true,
      customStyles: isSelected
        ? dayStyles.selectedStyle
        : dayStyles.availableStyle,
    };
  });

  function selectDate(day) {
    const { dateString } = day;
    if (availableDates.includes(dateString)) {
      setSelectedDate(dateString);
      onDateSelected(dateString);
    }
  }

  return (
    <Calendar
      markingType="custom"
      theme={calendarTheme}
      current={startDate}
      minDate={minDate}
      maxDate={maxDate}
      firstDay={1}
      markedDates={markedDates}
      onDayPress={(day) => selectDate(day)}
      showWeekNumbers
    />
  );
};

DayPicker.defaultProps = {
  startDate: new Date(),
};

export default DayPicker;
