import React, { useState } from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../../molecules/StoryWrapper';
import SummaryList from './SummaryList';
import { Input, FieldLabel, Text } from '../../atoms';

const stories = storiesOf('Summary List', module);

const items = [
  { id: 'f1', type: 'text', title: 'favoritfrukt', category: 'fruit' },
  { id: 'f2', type: 'text', title: 'grönsak', category: 'vegetable' },
];

const categories = [
  { category: 'fruit', description: 'Frukt' },
  { category: 'vegetable', description: 'Grönsak' },
];

const SummaryStory = () => {
  const [state, setState] = useState({});
  return (
    <>
      <FieldLabel>
        <Text>Frukt</Text>
      </FieldLabel>
      <Input
        value={state.f1}
        onChangeText={text => {
          setState(s => {
            s.f1 = text;
            return { ...s };
          });
        }}
      />
      <FieldLabel>
        <Text>Grönsak</Text>
      </FieldLabel>
      <Input
        value={state.f2}
        onChangeText={text => {
          setState(s => {
            s.f2 = text;
            return { ...s };
          });
        }}
      />
      <SummaryList
        heading="Sammanfattning"
        items={items}
        categories={categories}
        addButtonText="Add something"
        color="light"
        onChange={(answer, id) => {
          setState(s => {
            s[id] = answer;
            return { ...s };
          });
        }}
        d
        answers={state}
      />
    </>
  );
};

stories.add('default', () => (
  <StoryWrapper>
    <SummaryStory />
  </StoryWrapper>
));
