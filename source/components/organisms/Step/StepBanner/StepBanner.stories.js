import { storiesOf } from '@storybook/react-native';
import React from 'react';
import StoryWrapper from '../../../molecules/StoryWrapper';
import Banner from './StepBanner';

storiesOf('StepBanner', module)
  .add('Image', (props) => (
    <StoryWrapper {...props}>
      <Banner imageSrc="ILLU_EXPENSES" />
    </StoryWrapper>
  ))
  .add('Custom Styling', (props) => (
    <StoryWrapper {...props}>
      <Banner style={[{ backgroundColor: 'yellow' }]} colorSchema="blue" />
    </StoryWrapper>
  ))
  .add('Color Schema Blue', (props) => (
    <StoryWrapper {...props}>
      <Banner colorSchema="blue" />
    </StoryWrapper>
  ))
  .add('Color Schema Red', (props) => (
    <StoryWrapper {...props}>
      <Banner colorSchema="red" />
    </StoryWrapper>
  ))
  .add('Color Schema Green', (props) => (
    <StoryWrapper {...props}>
      <Banner colorSchema="green" />
    </StoryWrapper>
  ))
  .add('Color Schema Purple', (props) => (
    <StoryWrapper {...props}>
      <Banner colorSchema="purple" />
    </StoryWrapper>
  ));
