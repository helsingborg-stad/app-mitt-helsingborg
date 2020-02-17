import React from 'react';
import { DatePickerIOS } from 'react-native';
import { includePropetiesWithKey } from '../../helpers/Objects';
import ChatForm from './ChatForm';
import Input from '../atoms/Input';

const DateTimePickerForm = props => {
  const { changeHandler, submitHandler, inputValue, mode, selectorProps } = props;

  let dateTimeString;
  const date = typeof inputValue.getMonth === 'function' ? inputValue : new Date();
  const dateString = `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(
    2,
    0
  )}-${`${date.getDate()}`.padStart(2, 0)}`;
  const timeString = `${`${date.getHours()}`.padStart(2, 0)}:${`${date.getMinutes()}`.padStart(
    2,
    0
  )}`;

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

  const enhancedSubmitHandler = () => {
    dateTimeString.length > 0 ? submitHandler(dateTimeString) : null;
  };

  return (
    <ChatForm
      {...includePropetiesWithKey(props, ['isFocused', 'changeHandler', 'inputValue'])}
      submitHandler={enhancedSubmitHandler}
      renderFooter={() => (
        <DatePickerIOS date={date} onDateChange={changeHandler} mode={mode} {...selectorProps} />
      )}
    >
      <Input
        placeholder="Välj ett datum"
        {...props}
        editable={false}
        value={dateTimeString}
        onSubmitEditing={enhancedSubmitHandler}
      />
    </ChatForm>
  );
};

export default DateTimePickerForm;
