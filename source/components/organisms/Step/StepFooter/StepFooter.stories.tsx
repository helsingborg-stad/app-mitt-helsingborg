import { storiesOf } from '@storybook/react-native';
import React from 'react';
import StoryWrapper from '../../../molecules/StoryWrapper';
import StepFooter from './StepFooter';

const actions1 = [
  {
    type: 'next',
    color: 'green',
    label: 'Ja, allt stämmer',
  },
];
const actions2 = [
  {
    type: 'next',
    color: 'green',
    label: 'Yes!',
  },
  {
    type: 'next',
    color: 'red',
    label: 'No!',
  },
];
const actions3 = [
  {
    type: 'close',
    color: 'red',
    label: 'Close it',
  },
];

storiesOf('Footer', module).add('Forward/ Cancel', (props) => (
  <StoryWrapper {...props}>
    <StepFooter actions={actions1} />
    <StepFooter actions={actions2} background="#FFAA9B" />
    <StepFooter actions={actions3} />
  </StoryWrapper>
));
