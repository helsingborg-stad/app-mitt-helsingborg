import { storiesOf } from '@storybook/react-native';
import React, { useState } from 'react';
import DateTimePickerForm from './DateTimePickerForm';
import StoryWrapper from '../StoryWrapper';

const DateTimePicker = () => {
  const [value, setvalue] = useState('');

  return (
    <DateTimePickerForm
      value={value}
      onSelect={date => setvalue(date)}
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
  const [value, setvalue] = useState('');

  return (
    <DateTimePickerForm
      value={value}
      onSelect={date => setvalue(date)}
      placeholder="åååå-mm-dd"
      color="dark"
      mode="date"
      selectorProps={{
        locale: 'sv',
      }}
    />
  );
};

const TimePicker = () => {
  const [value, setvalue] = useState('');

  return (
    <DateTimePickerForm
      value={value}
      onSelect={date => setvalue(date)}
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
