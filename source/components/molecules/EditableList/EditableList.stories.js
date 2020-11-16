import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../StoryWrapper';
import EditableList from './EditableList';

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
    <EditableList
      inputIsEditable={false}
      onInputChange={() => {}}
      inputs={inputs}
      title="Editable List"
    />
  </StoryWrapper>
));

storiesOf('EditableList', module).add('Input is editable', () => (
  <StoryWrapper>
    <EditableList onInputChange={() => {}} inputs={inputs} title="Editable List" />
  </StoryWrapper>
));

storiesOf('EditableList', module).add('Color Schema', () => (
  <StoryWrapper>
    <EditableList onInputChange={() => {}} inputs={inputs} title="Blue (Default)" />
    <EditableList colorSchema="red" onInputChange={() => {}} inputs={inputs} title="Red" />
    <EditableList colorSchema="purple" onInputChange={() => {}} inputs={inputs} title="Purple" />
    <EditableList colorSchema="green" onInputChange={() => {}} inputs={inputs} title="Green" />
  </StoryWrapper>
));
