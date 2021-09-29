import React, { useState, useContext } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";
import moment from "moment";
import { ThemeContext } from "styled-components/native";
import localeConfig from "./localeConfig";

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
  const theme = useContext(ThemeContext);

  const colors = {
    selectedBackground: theme.colors.primary.red[0],
    selectedText: theme.colors.neutrals[7],
    availableBackground: theme.colors.complementary.red[2],
    availableText: theme.colors.primary.red[0],
    todayBorder: theme.colors.primary.red[3],
    todayText: theme.colors.primary.green[0],
    disabledText: theme.colors.neutrals[4],
  };

  const dayStyles = {
    availableStyle: {
      container: {
        backgroundColor: colors.availableBackground,
        borderRadius: 10,
        width: "90%",
      },
      text: {
        color: colors.availableText,
      },
    },
    selectedStyle: {
      container: {
        backgroundColor: colors.selectedBackground,
        borderRadius: 10,
        width: "90%",
      },
      text: {
        color: colors.selectedText,
      },
    },
    todayStyle: {
      container: {
        width: "90%",
        borderWidth: 2,
        borderColor: colors.todayBorder,
        borderRadius: 10,
      },
      text: {
        color: colors.todayText,
        left: -1,
        top: -1,
      },
    },
  };

  /* used as `theme` prop in <Calendar/> for styling internal components */
  const calendarTheme = {
    arrowColor: "black",
    textDayFontWeight: "600",
    textDisabledColor: colors.disabledText,
    textSectionTitleColor: colors.disabledText,
  };

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
