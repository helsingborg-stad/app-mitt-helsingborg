import PropTypes from 'prop-types';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, TouchableOpacity } from 'react-native';
import Input from '../../atoms/Input';

const DateTimePickerForm = props => {
  const { onSelect, inputValue, mode, selectorProps } = props;

  const [isVisible, setIsVisible] = useState(false);

  let dateTimeString;
  const date = inputValue && typeof inputValue.getMonth === 'function' ? inputValue : new Date();
  const dateString = `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(
    2,
    0
  )}-${`${date.getDate()}`.padStart(2, 0)}`;
  const timeString = `${`${date.getHours()}`.padStart(2, 0)}:${`${date.getMinutes()}`.padStart(
    2,
    0
  )}`;

  if (inputValue) {
    switch (mode) {
      case 'datetime':
        dateTimeString = `${dateString} ${timeString}`;
        break;

      case 'time':
        dateTimeString = timeString;
        break;

      default:
        dateTimeString = dateString;
    }
  }

  return (
    <View>
      <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
        <Input
          placeholder="åååå-mm-dd"
          editable={false}
          value={dateTimeString}
          pointerEvents="none"
          {...props}
        />
      </TouchableOpacity>
      {isVisible && (
        <DateTimePicker
          value={date}
          onChange={(_event, value) => onSelect(value)}
          mode={mode}
          {...selectorProps}
        />
      )}
    </View>
  );
};

DateTimePickerForm.propTypes = {
  /**
   * Function to set input date value
   */
  onSelect: PropTypes.func,
  /**
   * Value from the date picker
   */
  inputValue: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  /**
   * Defines the type of date picker
   */
  mode: PropTypes.string,
  /**
   * Is an object that can define the locale, minuteInterval or minimumDate
   */
  selectorProps: PropTypes.object,
  /**
   * Sets the color theme, default is light.
   */
  color: PropTypes.string,
};

DateTimePickerForm.defaultProps = {
  inputValue: '',
};

export default DateTimePickerForm;
