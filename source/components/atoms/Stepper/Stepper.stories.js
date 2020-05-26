import React from 'react';
import { storiesOf } from '@storybook/react-native';
import Stepper from './Stepper';
import StoryWrapper from '../../molecules/StoryWrapper';
import Text from '../Text/Text';

const arrayOfTextComponents = [
  <Text> Steg 1</Text>,
  <Text> Steg 2</Text>,
  <Text> Steg 3</Text>,
  <Text>Steg 4</Text>,
];

storiesOf('Stepper', module).add('default', () => (
  <StoryWrapper>
    <Stepper active={5}>{arrayOfTextComponents.map(item => item)}</Stepper>
  </StoryWrapper>
));
