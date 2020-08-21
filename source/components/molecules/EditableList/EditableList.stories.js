import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../StoryWrapper';
import FieldInputList from './EditableList';

const customEditableListTheme = {
  list: {
    bg: 'lightgrey',
    header: {
      color: 'black',
      bg: 'grey',
    },
    item: {
      label: {
        color: 'red',
      },
      input: {
        color: 'red',
      },
    },
  },
};

const inputs = [
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
];

storiesOf('EditableList', module).add('Default', () => (
  <StoryWrapper>
    <FieldInputList onInputChange={() => {}} inputs={inputs} title="Editable List" />
  </StoryWrapper>
));

storiesOf('EditableList', module).add('With Header Button', () => (
  <StoryWrapper>
    <FieldInputList onInputChange={() => {}} inputs={inputs} title="Editable List" />
  </StoryWrapper>
));

storiesOf('EditableList', module).add('Theming', () => (
  <StoryWrapper>
    <FieldInputList onInputChange={() => {}} inputs={inputs} title="Default theme" />
    <FieldInputList
      onInputChange={() => {}}
      inputs={inputs}
      theme={customEditableListTheme}
      title="Custom theme"
      inputIsEditable={false}
    />
  </StoryWrapper>
));
