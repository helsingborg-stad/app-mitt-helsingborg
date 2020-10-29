import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../StoryWrapper';
import BackNavigation from './BackNavigation';

const backNavigationStories = storiesOf('BackNavigation', module);

backNavigationStories.add('Default', props => (
  <StoryWrapper {...props}>
    <BackNavigation />
  </StoryWrapper>
));

backNavigationStories.add('Hide Back Button', props => (
  <StoryWrapper {...props}>
    <BackNavigation showBackButton={false} />
  </StoryWrapper>
));

backNavigationStories.add('Color Schema Blue', props => (
  <StoryWrapper {...props}>
    <BackNavigation isBackBtnVisible={false} />
  </StoryWrapper>
));
backNavigationStories.add('Color Schema Purple', props => (
  <StoryWrapper {...props}>
    <BackNavigation colorSchema="purple" isBackBtnVisible={false} />
  </StoryWrapper>
));
backNavigationStories.add('Color Schema Green', props => (
  <StoryWrapper {...props}>
    <BackNavigation colorSchema="green" isBackBtnVisible={false} />
  </StoryWrapper>
));
backNavigationStories.add('Color Schema Red', props => (
  <StoryWrapper {...props}>
    <BackNavigation colorSchema="red" isBackBtnVisible={false} />
  </StoryWrapper>
));
