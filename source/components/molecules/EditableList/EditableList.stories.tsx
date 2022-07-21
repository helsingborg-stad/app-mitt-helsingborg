import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { ScrollView } from 'react-native';
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
  {
    key: 'key-5',
    label: 'Person',
    type: 'select',
    value: '',
    items: [
      { label: 'Ehsan', value: 'ehsan' },
      { label: 'Jonatan', value: 'jonatan' },
      { label: 'Dan', value: 'dan' },
      { label: 'Teddy', value: 'teddy' },
      { label: 'Jacob', value: 'jacob' },
    ],
  },
  {
    key: 'key-4',
    label: 'Inflyttningsdatum',
    type: 'date',
    value: '2020-12-24',
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
    <ScrollView>
      <EditableList
        onInputChange={() => {}}
        inputs={inputs}
        title="Editable List"
        help={{ text: 'hello from the help text', heading: 'Do not fear, help is here' }}
      />
      <EditableList onInputChange={() => {}} inputs={inputs} title="Start editable" startEditable />
    </ScrollView>
  </StoryWrapper>
));

storiesOf('EditableList', module).add('Color Schema', () => (
  <StoryWrapper>
    <ScrollView>
      <EditableList
        onInputChange={() => {}}
        inputs={inputs}
        title="Blue (Default)"
        help={{ text: 'hello from the help text', heading: 'Do not fear, help is here' }}
      />
      <EditableList
        colorSchema="red"
        onInputChange={() => {}}
        inputs={inputs}
        title="Red"
        help={{ text: 'hello from the help text', heading: 'Do not fear, help is here' }}
      />
      <EditableList
        colorSchema="purple"
        onInputChange={() => {}}
        inputs={inputs}
        title="Purple"
        help={{ text: 'hello from the help text', heading: 'Do not fear, help is here' }}
      />
      <EditableList
        colorSchema="green"
        onInputChange={() => {}}
        inputs={inputs}
        title="Green"
        help={{ text: 'hello from the help text', heading: 'Do not fear, help is here' }}
      />
    </ScrollView>
  </StoryWrapper>
));
