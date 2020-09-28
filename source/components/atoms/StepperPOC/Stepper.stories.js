import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View } from 'react-native';
import Stepper from './Stepper';
import StoryWrapper from '../../molecules/StoryWrapper';
import Text from '../Text/Text';

const arrayOfTextComponents = [
  <Text> Steg 1</Text>,
  <Text> Steg 2</Text>,
  <Text> Steg 3</Text>,
  <Text>Steg 4</Text>,
];

const children = [
  { id: '1', text: 'helllo first' },
  { id: '2', text: 'helllo 2' },
  { id: '3', text: 'hello 3' },
  { id: '4', text: 'sub 1' },
  { id: '5', text: 'sub 2' },
];

const connections = {
  next: 1,
  back: 2,
  up: 3,
  down: 4,
};

const connectivityM = [
  ['none', 'next', 'none', 'down', 'none'],
  ['back', 'none', 'next', 'none', 'down'],
  ['none', 'back', 'none', 'none', 'none'],
  ['up', 'none', 'none', 'none', 'none'],
  ['none', 'up', 'none', 'none', 'none'],
];

storiesOf('New Stepper POC', module).add('default', () => (
  <StoryWrapper>
    <Stepper connectivityMatrix={connectivityM}>
      {children.map(item => (
        <View key={item.id}>
          <Text>{item.text}</Text>
        </View>
      ))}
    </Stepper>
  </StoryWrapper>
));
