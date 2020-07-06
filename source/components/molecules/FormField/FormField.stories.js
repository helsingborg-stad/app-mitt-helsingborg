import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../StoryWrapper';
import FormField from './FormField';

storiesOf('Form Field input', module).add('Default', () => (
  <StoryWrapper>
    <FormField
      id="1"
      label="Text input"
      color="light"
      placeholder="write something"
      inputType="text"
    />
    <FormField
      id="2"
      label="Text input, green"
      color="green"
      placeholder="write something else"
      inputType="text"
    />
    <FormField
      id="3"
      label="Number input"
      labelLine="false"
      color="red"
      placeholder="write a number..."
      inputType="number"
    />
    <FormField
      id="4"
      labelLine="false"
      color="red"
      placeholder="Look ma, no label!"
      inputType="text"
    />
    <FormField
      id="5"
      label="Checkbox input"
      labelLine="true"
      color="light"
      text="Do you feel it now?"
      inputType="checkbox"
      placeholder="Do you feel it now?"
    />
  </StoryWrapper>
));
