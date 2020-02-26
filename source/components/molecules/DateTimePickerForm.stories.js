import { storiesOf } from '@storybook/react-native';
import React, { useState } from 'react';
import DateTimePickerForm from './DateTimePickerForm';
import StoryWrapper from './StoryWrapper';

const DateTimePicker = () => {
  const [inputValue, setInputValue] = useState('');

  return (
    <DateTimePickerForm
      inputValue={inputValue}
      changeHandler={date => setInputValue(date)}
      submitHandler={() => alert(inputValue)}
      mode="datetime"
      placeholder="Date time"
      selectorProps={{
        minuteInterval: 30,
        locale: 'sv',
        minimumDate: new Date(),
      }}
    />
  );
};

const DatePicker = () => {
  const [inputValue, setInputValue] = useState('');

  return (
    <DateTimePickerForm
      inputValue={inputValue}
      changeHandler={date => setInputValue(date)}
      submitHandler={() => alert(inputValue)}
      placeholder="Date"
      mode="date"
      selectorProps={{
        locale: 'sv',
        minimumDate: new Date(),
      }}
    />
  );
};

const TimePicker = () => {
  const [inputValue, setInputValue] = useState('');

  return (
    <DateTimePickerForm
      inputValue={inputValue}
      changeHandler={date => setInputValue(date)}
      submitHandler={() => alert(inputValue)}
      mode="time"
      placeholder="Time"
      selectorProps={{
        locale: 'sv',
        minuteInterval: 30,
      }}
    />
  );
};

storiesOf('Date time picker', module)
  .add('Date time picker', () => (
    <StoryWrapper>
      <DateTimePicker />
    </StoryWrapper>
  ))
  .add('Date picker', () => (
    <StoryWrapper>
      <DatePicker />
    </StoryWrapper>
  ))
  .add('Time picker', () => (
    <StoryWrapper>
      <TimePicker />
    </StoryWrapper>
  ));
