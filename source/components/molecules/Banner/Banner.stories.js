import { storiesOf } from '@storybook/react-native';
import React from 'react';
import StoryWrapper from '../StoryWrapper';
import Banner from './Banner';

const ILLU_EXPENSES = require('source/assets/images/illustrations/illu_utgifter_margins_1x.png');
const ICON_INCOME = require('source/assets/images/icons/icn_inkomster_1x.png');
const ICON_EKB = require('source/assets/images/icons/icn_Main_ekonomiskt-bistand_1x.png');
const ICON_EXPENSES = require('source/assets/images/icons/icn_utgifter_1x.png');

storiesOf('Banner', module)
  .add('Icon', props => (
    <StoryWrapper {...props}>
      <Banner iconSrc={ICON_EKB} />
    </StoryWrapper>
  ))
  .add('Icon & Image', props => (
    <StoryWrapper {...props}>
      <Banner imageSrc={ILLU_EXPENSES} iconSrc={ICON_EXPENSES} />
    </StoryWrapper>
  ))
  .add('Custom Styling', props => (
    <StoryWrapper {...props}>
      <Banner style={{ backgroundColor: 'yellow' }} colorSchema="blue" iconSrc={ICON_INCOME} />
    </StoryWrapper>
  ))
  .add('Color Schema Blue', props => (
    <StoryWrapper {...props}>
      <Banner colorSchema="blue" iconSrc={ICON_INCOME} />
    </StoryWrapper>
  ))
  .add('Color Schema Red', props => (
    <StoryWrapper {...props}>
      <Banner colorSchema="red" iconSrc={ICON_INCOME} />
    </StoryWrapper>
  ))
  .add('Color Schema Green', props => (
    <StoryWrapper {...props}>
      <Banner colorSchema="green" iconSrc={ICON_INCOME} />
    </StoryWrapper>
  ))
  .add('Color Schema Purple', props => (
    <StoryWrapper {...props}>
      <Banner colorSchema="purple" iconSrc={ICON_INCOME} />
    </StoryWrapper>
  ));
