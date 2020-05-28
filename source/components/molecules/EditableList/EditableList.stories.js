import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../StoryWrapper';
import FieldInputList from './EditableList';
import { Button, Text } from '../../atoms';

const HeaderButton = () => (
  <Button z="0" size="small">
    <Text>Change</Text>
  </Button>
);
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

storiesOf('EditableList', module).add('Default', () => (
  <StoryWrapper>
    <FieldInputList title="Editable List" />
  </StoryWrapper>
));

storiesOf('EditableList', module).add('With Header Button', () => (
  <StoryWrapper>
    <FieldInputList title="Editable List" headerButton={HeaderButton} />
  </StoryWrapper>
));

storiesOf('EditableList', module).add('Theming', () => (
  <StoryWrapper>
    <FieldInputList title="Default theme" headerButton={HeaderButton} />
    <FieldInputList
      theme={customEditableListTheme}
      title="Custom theme"
      headerButton={HeaderButton}
    />
  </StoryWrapper>
));
