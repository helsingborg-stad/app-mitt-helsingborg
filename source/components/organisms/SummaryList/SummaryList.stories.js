import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../../molecules/StoryWrapper';
import SummaryList from './SummaryList';
import { Input, Label, Text } from '../../atoms';

const stories = storiesOf('Summary List', module);

const items = [
  { id: 'f1', type: 'text', title: 'favoritfrukt', category: 'fruit' },
  { id: 'f2', type: 'text', title: 'grönsak', category: 'vegetable' },
  { id: 'pris1', type: 'number', title: 'pris1', category: 'fruit' },
  { id: 'pris2', type: 'number', title: 'pris2', category: 'vegetable' },
];

const categories = [
  { category: 'fruit', description: 'Frukt' },
  { category: 'vegetable', description: 'Grönsak' },
];

const SummaryStory = () => {
  const [state, setState] = useState({});
  return (
    <ScrollView>
      <Text>Fyll i några fält för att visa sammanfattningen</Text>
      <Label>
        <Text>Favoritfrukt</Text>
      </Label>
      <Input
        value={state.f1}
        onChangeText={text => {
          setState(s => {
            s.f1 = text;
            return { ...s };
          });
        }}
      />
      <Label>
        <Text>Fruktens pris</Text>
      </Label>
      <Input
        value={state.pris1}
        onChangeText={text => {
          setState(s => {
            s.pris1 = text;
            return { ...s };
          });
        }}
      />
      <Label>
        <Text>Favoritgrönsak</Text>
      </Label>
      <Input
        value={state.f2}
        onChangeText={text => {
          setState(s => {
            s.f2 = text;
            return { ...s };
          });
        }}
      />
      <Label>
        <Text>Grönsakens pris</Text>
      </Label>
      <Input
        value={state.pris2}
        onChangeText={text => {
          setState(s => {
            s.pris2 = text;
            return { ...s };
          });
        }}
      />
      <SummaryList
        heading="Sammanfattning"
        items={items}
        categories={categories}
        color="green"
        onChange={(answer, id) => {
          setState(s => {
            s[id] = answer;
            return { ...s };
          });
        }}
        answers={state}
        showSum
      />
    </ScrollView>
  );
};

stories.add('default', () => (
  <StoryWrapper>
    <SummaryStory />
  </StoryWrapper>
));
