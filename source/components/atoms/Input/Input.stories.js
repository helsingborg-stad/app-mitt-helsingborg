/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../../molecules/StoryWrapper';
import Input from './index';
import withForm from '../../organisms/withForm';

const InputWithForm = withForm(props => (
  <Input
    value={props.inputValue}
    onChangeText={props.changeHandler}
    onSubmitEditing={props.submitHandler}
    {...props}
  />
));

storiesOf('Input', module)
  .add('Keyboard type default', () => (
    <StoryWrapper>
      <InputWithForm placeholder="Type something, blue input" />
      <InputWithForm colorSchema="purple" placeholder="Purple input" center />
      <InputWithForm colorSchema="red" placeholder="Red input" />
      <InputWithForm colorSchema="green" placeholder="Green input" />
    </StoryWrapper>
  ))
  .add('Keyboard type numeric', () => (
    <StoryWrapper>
      <InputWithForm placeholder="Type some numbers, blue theme" keyboardType="numeric" />
      <InputWithForm colorSchema="purple" placeholder="Purple input" keyboardType="numeric" />
      <InputWithForm colorSchema="red" placeholder="Red input" keyboardType="numeric" />
      <InputWithForm colorSchema="green" placeholder="Green input" keyboardType="numeric" />
    </StoryWrapper>
  ))
  .add('Keyboard type phone pad', () => (
    <StoryWrapper>
      <InputWithForm placeholder="Type some number using phone pad" keyboardType="phone-pad" />
      <InputWithForm colorSchema="purple" placeholder="Purple input" keyboardType="phone-pad" />
      <InputWithForm colorSchema="red" placeholder="Red input" keyboardType="phone-pad" />
      <InputWithForm colorSchema="green" placeholder="Green input" keyboardType="phone-pad" />
    </StoryWrapper>
  ));
