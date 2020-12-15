import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../StoryWrapper';
import PersonFieldCard from './PersonField';

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

storiesOf('Person Field Card', module).add('Default', (props) => (
  <StoryWrapper {...props}>
    <PersonFieldCard
      firstName="Tuva"
      lastName="Tuvasson"
      personalNumber={19980304056789}
      relation="Min fru"
      inputs={inputs}
    />
  </StoryWrapper>
));

storiesOf('Person Field Card', module).add('Editable', (props) => (
  <StoryWrapper {...props}>
    <PersonFieldCard
      firstName="Tuva"
      lastName="Tuvasson"
      personalNumber={19980304056789}
      relation="Min fru"
      inputs={inputs}
      isEditable
    />
  </StoryWrapper>
));
