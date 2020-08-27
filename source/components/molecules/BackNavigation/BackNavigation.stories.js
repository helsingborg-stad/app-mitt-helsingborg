import React from 'react';
import { storiesOf } from '@storybook/react-native';
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
