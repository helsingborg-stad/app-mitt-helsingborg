import { storiesOf } from '@storybook/react-native';
import React from 'react';
import StoryWrapper from '../StoryWrapper';
import ButtonField from './ButtonField';

storiesOf('ButtonField', module)
  .add('default', () => (
    <StoryWrapper>
      <ButtonField text="Lägg till inkomster" />
    </StoryWrapper>
  ))
  .add('With Icon', () => (
    <StoryWrapper>
      <ButtonField iconName="arrow-forward" color="blue" text="Hantera familj" />
    </StoryWrapper>
  ))
  .add('With Text', () => (
    <StoryWrapper>
      <ButtonField text="Vad är riksnormen" color="green" />
    </StoryWrapper>
  ))
  .add('With help Button ', () => (
    <StoryWrapper>
      <ButtonField text="Vad är riksnormen" iconName="info" color="coral" />
      <ButtonField text="Vad är riksnormen" iconName="info" color="areo" />
    </StoryWrapper>
  ));
