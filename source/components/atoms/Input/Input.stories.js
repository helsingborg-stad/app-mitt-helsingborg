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
      <InputWithForm placeholder="Type something" />
    </StoryWrapper>
  ))
  .add('numeric', () => (
    <StoryWrapper>
      <InputWithForm placeholder="Type some numbers" keyboardType="numeric" />
    </StoryWrapper>
  ))
  .add('phone pad', () => (
    <StoryWrapper>
      <InputWithForm placeholder="Type some number using phone pad" keyboardType="phone-pad" />
    </StoryWrapper>
  ));
