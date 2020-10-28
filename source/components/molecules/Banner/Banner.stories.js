import { storiesOf } from '@storybook/react-native';
import React from 'react';
import StoryWrapper from '../StoryWrapper';
import Banner from './Banner';

const ILLU_EXPENSES = require('source/assets/images/illustrations/illu_utgifter_margins_1x.png');

storiesOf('Banner', module)
  .add('Image', props => (
    <StoryWrapper {...props}>
      <Banner imageSrc={ILLU_EXPENSES} />
    </StoryWrapper>
  ))
  .add('Custom Styling', props => (
    <StoryWrapper {...props}>
      <Banner style={{ backgroundColor: 'yellow' }} colorSchema="blue" />
    </StoryWrapper>
  ))
  .add('Color Schema Blue', props => (
    <StoryWrapper {...props}>
      <Banner colorSchema="blue" />
    </StoryWrapper>
  ))
  .add('Color Schema Red', props => (
    <StoryWrapper {...props}>
      <Banner colorSchema="red" />
    </StoryWrapper>
  ))
  .add('Color Schema Green', props => (
    <StoryWrapper {...props}>
      <Banner colorSchema="green" />
    </StoryWrapper>
  ))
  .add('Color Schema Purple', props => (
    <StoryWrapper {...props}>
      <Banner colorSchema="purple" />
    </StoryWrapper>
  ));
