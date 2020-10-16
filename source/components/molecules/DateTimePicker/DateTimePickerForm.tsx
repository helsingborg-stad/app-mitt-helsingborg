import PropTypes from 'prop-types';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, TouchableOpacity, Platform } from 'react-native';
import Input from '../../atoms/Input';

interface Props {
  onSelect: (date: Date) => void;
  value: string | number;
  mode: 'datetime' | 'time' | 'date';
  color: string;
  selectorProps: Record<string, any>;
}

const DateTimePickerForm: React.FC<Props> = ({
  onSelect,
  value,
  mode,
  selectorProps,
  color,
  ...other
}) => {
  const [isVisible, setIsVisible] = useState(false);

  let dateTimeString: string;
  const date = value ? new Date(value) : new Date();

  const dateString = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date
    .getDate()
    .toString()
    .padStart(2, '0')}`;
  const timeString = `${date
    .getHours()
    .toString()
    .padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
  if (value) {
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

  const onChange = (date: Date) => {
    setIsVisible(Platform.OS === 'ios');
    onSelect(date);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
        <Input
          placeholder="åååå-mm-dd"
          editable={false}
          value={dateTimeString}
          pointerEvents="none"
          center
          color={color}
          {...other}
        />
      </TouchableOpacity>
      {isVisible && (
        <DateTimePicker
          value={date}
          onChange={(_event, date) => onChange(date)}
          mode={mode}
          textColor={color === 'light' ? 'white' : 'dark'}
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
  value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
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
  value: '',
};

export default DateTimePickerForm;
