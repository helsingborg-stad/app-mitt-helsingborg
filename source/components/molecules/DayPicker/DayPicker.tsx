import React, { useContext } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";
import moment from "moment";
import { ThemeContext } from "styled-components/native";
import localeConfig from "./localeConfig";
import getTheme from "./getTheme";

LocaleConfig.locales.se = localeConfig;
LocaleConfig.defaultLocale = "se";

interface DayPickerProps {
  availableDates: string[];
  onDateSelected: (dateString: string) => void;
  selectedDate: string;
  startDate?: string;
}

const DayPicker: React.FC<DayPickerProps> = ({
  availableDates,
  onDateSelected,
  selectedDate,
  startDate,
}) => {
  const theme = useContext(ThemeContext);

  const { dayStyles, calendarTheme } = getTheme(theme);

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

  const selectDate = (day) => {
    const { dateString } = day;
    if (availableDates.includes(dateString)) {
      onDateSelected(dateString);
    }
  };

  return (
    <Calendar
      markingType="custom"
      theme={calendarTheme}
      current={startDate}
      minDate={minDate}
      maxDate={maxDate}
      firstDay={1}
      markedDates={markedDates}
      onDayPress={selectDate}
      showWeekNumbers
    />
  );
};

DayPicker.defaultProps = {
  startDate: moment().format("yyyy-MM-DD"),
};

export default DayPicker;
