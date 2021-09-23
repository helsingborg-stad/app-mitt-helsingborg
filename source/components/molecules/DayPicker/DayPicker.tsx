import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';

LocaleConfig.locales.se = {
  monthNames: [
    'januari',
    'februari',
    'mars',
    'april',
    'maj',
    'juni',
    'juli',
    'augusti',
    'september',
    'october',
    'november',
    'december',
  ],
  monthNamesShort: [
    'jan',
    'feb',
    'mar',
    'apr',
    'maj',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
  ],
  dayNames: ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'],
  dayNamesShort: ['sön', 'mån', 'tis', 'ons', 'tor', 'fre', 'mån'],
  today: 'idag',
};
LocaleConfig.defaultLocale = 'se';

const colors = {
  selectedBackground: '#ae0b05',
  selectedText: '#ffffff',
  availableBackground: '#f5e4e3',
  availableText: '#770000',
  todayBorder: '#e84c31',
  todayText: '#205400',
  disabledText: '#a3a3a3',
};

const dayStyles = {
  availableStyle: {
    container: {
      backgroundColor: colors.availableBackground,
      borderRadius: 10,
      width: '90%',
    },
    text: {
      color: colors.availableText,
    },
  },
  selectedStyle: {
    container: {
      backgroundColor: colors.selectedBackground,
      borderRadius: 10,
      width: '90%',
    },
    text: {
      color: colors.selectedText,
    },
  },
  todayStyle: {
    container: {
      width: '90%',
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

const calendarTheme = {
  arrowColor: 'black',
  textDayFontWeight: '600',
  textDisabledColor: colors.disabledText,
  textSectionTitleColor: colors.disabledText,
  'stylesheet.calendar.header': {
    week: {
      color: 'black',
    },
  },
};

const DayPicker = (props) => {
  const [selectedDate, setSelectedDate] = useState();

  const { availableDates, startDate, onDateSelected } = props;
  const minDate = startDate || Date();
  const minDateString = moment(minDate).format('yyyy-MM-DD');
  const maxDate = moment(minDate).add(3, 'M').toDate();
  const markedDates = {};
  markedDates[minDateString] = {
    customStyles: dayStyles.todayStyle,
  };
  availableDates.forEach((date) => {
    const isSelected = date === selectedDate;
    markedDates[date] = {
      selected: true,
      customStyles: isSelected ? dayStyles.selectedStyle : dayStyles.availableStyle,
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
    <View>
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
    </View>
  );
};

export default DayPicker;
