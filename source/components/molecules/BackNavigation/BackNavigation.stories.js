import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import StoryWrapper from '../StoryWrapper';
import BackNavigation from './BackNavigation';

storiesOf('BackNavigation', module)
  .add('Default', props => (
    <StoryWrapper {...props}>
      <BackNavigation />
    </StoryWrapper>
  ))
  .add('Hide Back Button', props => (
    <StoryWrapper {...props}>
      <BackNavigation isBackBtnVisible={false} />
    </StoryWrapper>
  ));
