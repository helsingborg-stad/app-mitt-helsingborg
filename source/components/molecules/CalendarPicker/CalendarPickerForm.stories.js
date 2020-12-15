import React, { useState } from 'react';
import { storiesOf } from '@storybook/react-native';
import CalendarPickerForm from './CalendarPickerForm';
import { StoryWrapper } from '../index';

const CalendarPicker = () => {
  const [date, setDate] = useState('');

  return (
    <CalendarPickerForm
      date={date}
      onSelect={(selectedDate) => {
        setDate(selectedDate);
      }}
      value=""
    />
  );
};

storiesOf('Calendar picker', module).add('Default', () => (
  <StoryWrapper>
    <CalendarPicker />
  </StoryWrapper>
));
