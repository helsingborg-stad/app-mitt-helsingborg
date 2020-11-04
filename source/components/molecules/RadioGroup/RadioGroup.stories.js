import React, { useState } from 'react';
import { storiesOf } from '@storybook/react-native';
import { ScrollView } from 'react-native';
import StoryWrapper from '../StoryWrapper';
import RadioGroup from './RadioGroup';
import Label from '../../atoms/Label';

storiesOf('RadioGroup', module).add('Default', props => (
  <StoryWrapper {...props}>
    <RadioGroupStory />
  </StoryWrapper>
));

const choices = [
  { displayText: 'Choice 1', value: '1' },
  { displayText: 'Choice 2 some other stuff', value: '2' },
  {
    displayText:
      'Choice 3, with some more text that can go on and wrap onto new lines and just keep going and going and going and so on and etcetera',
    value: '3',
  },
];

const RadioGroupStory = () => {
  const [value, setValue] = useState('');

  return (
    <ScrollView>
      <Label underline={false}>Blue color</Label>
      <RadioGroup choices={choices} onSelect={setValue} value={value} />
      <Label underline={false}>Green color</Label>
      <RadioGroup choices={choices} onSelect={setValue} value={value} colorSchema="green" />
      <Label underline={false}>Medium, Red color</Label>
      <RadioGroup
        choices={choices}
        onSelect={setValue}
        value={value}
        colorSchema="red"
        size="medium"
      />
      <Label underline={false}>Large, Purple color</Label>
      <RadioGroup
        choices={choices}
        onSelect={setValue}
        value={value}
        colorSchema="purple"
        size="large"
      />
    </ScrollView>
  );
};
