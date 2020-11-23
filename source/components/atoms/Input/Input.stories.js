/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../../molecules/StoryWrapper';
import Input from './index';

storiesOf('Input', module)
  .add('Keyboard type default', () => (
    <StoryWrapper>
      <Input placeholder="Type some numbers, blue theme" keyboardType="numeric" />
      <Input colorSchema="purple" placeholder="Purple input" center />
      <Input colorSchema="red" placeholder="Red input" />
      <Input colorSchema="green" placeholder="Green input" />
    </StoryWrapper>
  ))
  .add('Keyboard type numeric', () => (
    <StoryWrapper>
      <Input placeholder="Type some numbers, blue theme" keyboardType="numeric" />
      <Input colorSchema="purple" placeholder="Purple input" keyboardType="numeric" />
      <Input colorSchema="red" placeholder="Red input" keyboardType="numeric" />
      <Input colorSchema="green" placeholder="Green input" keyboardType="numeric" />
    </StoryWrapper>
  ))
  .add('Keyboard type phone pad', () => (
    <StoryWrapper>
      <Input placeholder="Type some number using phone pad" keyboardType="phone-pad" />
      <Input colorSchema="purple" placeholder="Purple input" keyboardType="phone-pad" />
      <Input colorSchema="red" placeholder="Red input" keyboardType="phone-pad" />
      <Input colorSchema="green" placeholder="Green input" keyboardType="phone-pad" />
    </StoryWrapper>
  ))
  .add('Input with failed validation', () => (
    <StoryWrapper>
      <Input
        placeholder="Type something, blue input"
        value="This is an input with failed validation"
        error={{ isValid: false, message: 'Validation failed' }}
      />
    </StoryWrapper>
  ));
