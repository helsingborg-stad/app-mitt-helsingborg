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
  .add('Background', props => (
    <StoryWrapper {...props}>
      <Banner backgroundColor="#75C9A8" iconSrc={ICON_INCOME} />
    </StoryWrapper>
  ));
