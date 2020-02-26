import PropTypes from 'prop-types';
import React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { includePropetiesWithKey } from '../../helpers/Objects';
import ChatForm from './ChatForm';
import Input from '../atoms/Input';

const DateTimePickerForm = props => {
  const { changeHandler, submitHandler, inputValue, mode, selectorProps } = props;

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
      case 'date':
        dateTimeString = dateString;
        break;

      case 'time':
        dateTimeString = timeString;
        break;

      default:
        dateTimeString = `${dateString} ${timeString}`;
    }
  }

  return (
    <ChatForm
      {...includePropetiesWithKey(props, ['isFocused', 'changeHandler', 'inputValue'])}
      submitHandler={() => submitHandler(dateTimeString)}
      renderFooter={() => (
        <DateTimePicker
          value={date}
          onChange={(_event, value) => changeHandler(value)}
          mode={mode}
          {...selectorProps}
        />
      )}
    >
      <Input
        placeholder="Välj ett datum"
        {...props}
        editable={false}
        value={dateTimeString}
        onSubmitEditing={() => submitHandler(dateTimeString)}
      />
    </ChatForm>
  );
};

DateTimePickerForm.propTypes = {
  changeHandler: PropTypes.func,
  inputValue: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  mode: PropTypes.string,
  selectorProps: PropTypes.object,
  submitHandler: PropTypes.func,
};

DateTimePickerForm.defaultProps = {
  inputValue: '',
};

export default DateTimePickerForm;
