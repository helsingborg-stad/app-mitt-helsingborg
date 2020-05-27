import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../StoryWrapper';
import FieldInputList from './EditableList';

storiesOf('FieldInputList', module).add('default', () => (
  <StoryWrapper>
    <FieldInputList title="Editable List" />
  </StoryWrapper>
));
