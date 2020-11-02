import { storiesOf } from '@storybook/react-native';
import React from 'react';
import StoryWrapper from '../../../molecules/StoryWrapper';
import FooterAction from './FooterAction';

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

storiesOf('Footer', module).add('Forward/ Cancel', props => (
  <StoryWrapper {...props}>
    <FooterAction actions={actions1} />
    <FooterAction actions={actions2} background="#FFAA9B" />
    <FooterAction actions={actions3} />
  </StoryWrapper>
));
