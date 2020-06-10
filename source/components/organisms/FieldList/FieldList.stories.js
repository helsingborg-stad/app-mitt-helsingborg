import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../../molecules/StoryWrapper';
import FieldList from './FieldList';

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
      color: '#2E5043',
      bg: '#75C9A8',
    },
    item: {
      label: {
        color: '#2E5043',
      },
      input: {
        color: '#00213f',
      },
    },
  },
};
storiesOf('Form Field', module)
  .add('Default', () => (
    <StoryWrapper>
      <FieldList fields={mockData} onInputChange={() => {}} />
    </StoryWrapper>
  ))
  .add('Custom Theme', () => (
    <StoryWrapper>
      <FieldList fields={mockData} theme={theme} onInputChange={() => {}} />
    </StoryWrapper>
  ));
