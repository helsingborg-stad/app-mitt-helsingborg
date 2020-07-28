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
  .add('default', () => (
    <StoryWrapper>
      <InputWithForm placeholder="Type something, light theme" />
      <InputWithForm color="dark" placeholder="Dark theme" />
      <InputWithForm color="dark" placeholder="Dark theme" center />
      <InputWithForm color="red" placeholder="Red theme" />
      <InputWithForm color="green" placeholder="Green theme" />
    </StoryWrapper>
  ))
  .add('numeric', () => (
    <StoryWrapper>
      <InputWithForm placeholder="Type some numbers, light theme" keyboardType="numeric" />
      <InputWithForm color="dark" placeholder="Dark theme" keyboardType="numeric" />
      <InputWithForm color="red" placeholder="Red theme" keyboardType="numeric" />
      <InputWithForm color="green" placeholder="Green theme" keyboardType="numeric" />
    </StoryWrapper>
  ))
  .add('phone pad', () => (
    <StoryWrapper>
      <InputWithForm placeholder="Type some number using phone pad" keyboardType="phone-pad" />
      <InputWithForm color="dark" placeholder="Dark theme" keyboardType="phone-pad" />
      <InputWithForm color="red" placeholder="Red theme" keyboardType="phone-pad" />
      <InputWithForm color="green" placeholder="Green theme" keyboardType="phone-pad" />
    </StoryWrapper>
  ));
