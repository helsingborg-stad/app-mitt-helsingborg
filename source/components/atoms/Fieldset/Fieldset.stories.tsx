import { storiesOf } from '@storybook/react-native';
import React from 'react';
import StoryWrapper from '../../molecules/StoryWrapper';
import Fieldset from './Fieldset';

const fieldsetStories = storiesOf('Fieldset', module);

fieldsetStories.add('default', () => (
  <StoryWrapper>
    <Fieldset legend="Tillgångar" />
  </StoryWrapper>
));

fieldsetStories.add('With Help', () => (
  <StoryWrapper>
    <Fieldset
      legend="Tillgångar"
      help={{ text: 'hello from the help text', heading: 'Do not fear, help is here' }}
    />
  </StoryWrapper>
));
fieldsetStories.add('Color Schemas', () => (
  <StoryWrapper>
    <Fieldset
      legend="Blue (default)"
      help={{ text: 'hello from the help text', heading: 'Do not fear, help is here' }}
    />
    <Fieldset
      legend="Red"
      colorSchema="red"
      help={{ text: 'hello from the help text', heading: 'Do not fear, help is here' }}
    />
    <Fieldset legend="Purple" colorSchema="purple" />
    <Fieldset legend="Green" colorSchema="green" />
  </StoryWrapper>
));
