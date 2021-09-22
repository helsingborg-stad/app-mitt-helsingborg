import { storiesOf } from '@storybook/react-native';
import React, { useState } from 'react';
import DayPicker from './DayPicker';
import StoryWrapper from '../StoryWrapper';

const StoryDayPicker = () => <DayPicker />;

storiesOf('Day picker', module).add('Default', () => (
  <StoryWrapper>
    <StoryDayPicker />
  </StoryWrapper>
));
