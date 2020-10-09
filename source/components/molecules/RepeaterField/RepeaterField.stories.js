import React, { useState } from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../StoryWrapper';
import RepeaterField from './RepeaterField';

const repeaterFieldStories = storiesOf('RepeaterField', module);

const inputs = [
  { id: 'number', type: 'number', title: 'Test number' },
  { id: 'text', type: 'text', title: 'Test text' },
  { id: 'date', type: 'date', title: 'Test date' },
];

const RepeaterStory = () => {
  const [state, setState] = useState([]);

  return (
    <RepeaterField
      heading="Repeater Field"
      inputs={inputs}
      addButtonText="Add something"
      color="light"
      onChange={answer => {
        setState([...answer]);
      }}
      value={state}
      answers={{}}
    />
  );
};

repeaterFieldStories.add('default', () => (
  <StoryWrapper>
    <RepeaterStory />
  </StoryWrapper>
));
