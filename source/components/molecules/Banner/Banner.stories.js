import { storiesOf } from '@storybook/react-native';
import React from 'react';
import StoryWrapper from '../StoryWrapper';
import Banner from './Banner';

storiesOf('Banner', module)
  .add('Logo', props => (
    <StoryWrapper {...props}>
      <Banner image="logo" />
    </StoryWrapper>
  ))
  .add('CoApplication', props => (
    <StoryWrapper {...props}>
      <Banner image="coApplication" />
    </StoryWrapper>
  ))
  .add('Income', props => (
    <StoryWrapper {...props}>
      <Banner image="income" />
    </StoryWrapper>
  ))
  .add('AddIncome', props => (
    <StoryWrapper {...props}>
      <Banner image="addIncome" />
    </StoryWrapper>
  ))
  .add('medicine', props => (
    <StoryWrapper {...props}>
      <Banner image="medicine" />
    </StoryWrapper>
  ))
  .add('ExpensePage', props => (
    <StoryWrapper {...props}>
      <Banner image="expensePage" />
    </StoryWrapper>
  ))
  .add('ExpenseList', props => (
    <StoryWrapper {...props}>
      <Banner image="expenseList" />
    </StoryWrapper>
  ))
  .add('Message', props => (
    <StoryWrapper {...props}>
      <Banner image="message" />
    </StoryWrapper>
  ))
  .add('complete', props => (
    <StoryWrapper {...props}>
      <Banner image="complete" />
    </StoryWrapper>
  ))
  .add('Default', props => (
    <StoryWrapper {...props}>
      <Banner message="" />
    </StoryWrapper>
  ));
