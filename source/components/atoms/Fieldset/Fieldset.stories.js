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

fieldsetStories.add('With Icon', () => (
  <StoryWrapper>
    <Fieldset
      legend="Tillgångar"
      onIconPress={() => console.log('Icon is pressed')}
      iconName="help-outline"
    />
  </StoryWrapper>
));
fieldsetStories.add('Color Schemas', () => (
  <StoryWrapper>
    <Fieldset
      legend="Blue (default)"
      onIconPress={() => console.log('Icon is pressed')}
      iconName="help-outline"
    />
    <Fieldset
      legend="Red"
      onIconPress={() => console.log('Icon is pressed')}
      iconName="help-outline"
      colorSchema="red"
    />
    <Fieldset
      legend="Purple"
      onIconPress={() => console.log('Icon is pressed')}
      iconName="help-outline"
      colorSchema="purple"
    />
    <Fieldset
      legend="Green"
      onIconPress={() => console.log('Icon is pressed')}
      iconName="help-outline"
      colorSchema="green"
    />
  </StoryWrapper>
));
