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
          setState(oldState => {
            oldState.f1 = text;
            return { ...oldState };
          });
        }}
      />
      <Label>
        <Text>Fruktens pris</Text>
      </Label>
      <Input
        value={state.pris1}
        onChangeText={text => {
          setState(oldState => {
            oldState.pris1 = text;
            return { ...oldState };
          });
        }}
      />
      <Label>
        <Text>Favoritgrönsak</Text>
      </Label>
      <Input
        value={state.f2}
        onChangeText={text => {
          setState(oldState => {
            oldState.f2 = text;
            return { ...oldState };
          });
        }}
      />
      <Label>
        <Text>Grönsakens pris</Text>
      </Label>
      <Input
        value={state.pris2}
        onChangeText={text => {
          setState(oldState => {
            oldState.pris2 = text;
            return { ...oldState };
          });
        }}
      />
      <SummaryList
        heading="Sammanfattning"
        items={items}
        categories={categories}
        color="green"
        onChange={(answer, id) => {
          setState(oldState => {
            oldState[id] = answer;
            return { ...oldState };
          });
        }}
        answers={state}
        showSum
      />
      <SummaryList
        heading="Blå, ingen summa"
        items={items}
        categories={categories}
        color="blue"
        onChange={(answer, id) => {
          setState(oldState => {
            oldState[id] = answer;
            return { ...oldState };
          });
        }}
        answers={state}
        showSum={false}
        startEditable
      />
    </ScrollView>
  );
};

stories.add('default', () => (
  <StoryWrapper>
    <SummaryStory />
  </StoryWrapper>
));
