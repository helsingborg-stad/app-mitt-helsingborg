import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../StoryWrapper';
import SwitchAction from './SwitchAction';

const mockData = [
  {
    fieldType: 'address',
    title: 'Boende/Tillgånger',
    inputs: [
      {
        key: 'key-1',
        label: 'Adress',
        type: 'text',
        value: 'Storgatan 9, Helsingborg',
      },
      {
        key: 'key-2',
        label: 'Storlek',
        type: 'text',
        value: '1 rum & kök',
      },
      {
        key: 'key-3',
        label: 'Hyresvärd',
        type: 'text',
        value: 'Helsingborgshem',
      },
    ],
  },
  {
    fieldType: 'personal',
    title: 'Mina Uppgifter',
    inputs: [
      {
        key: 'key-1',
        label: 'Epost',
        type: 'text',
        value: 'namn.efternamn@epost.se',
      },
      {
        key: 'key-2',
        label: 'Telefone',
        type: 'text',
        value: '070-000 00 00',
      },
      {
        key: 'key-3',
        label: 'Medborgarskap',
        type: 'text',
        value: 'Svenskt',
      },
      {
        key: 'key-4',
        label: 'Sysselsättning',
        type: 'text',
        value: 'Arbetssökande',
      },
    ],
  },
];

const theme = {
  list: {
    bg: '#FBF7F0',
    header: {
      color: '#5C3D38',
      bg: '#f5e0d8',
    },
    item: {
      label: {
        color: '#855851',
      },
      input: {
        color: '#00213f',
      },
    },
  },
};
storiesOf('SwitchAction', module).add('Default', () => (
  <StoryWrapper>
    <SwitchAction fields={mockData} theme={theme} />
  </StoryWrapper>
));
