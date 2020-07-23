import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'source/components/atoms';
import StoryWrapper from '../StoryWrapper';
import FooterAction from './FooterAction';

const styles = StyleSheet.create({
  buttonWrapper: {
    display: 'flex',
    flexGrow: 10,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 18,
  },
});

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
