import React, { useState } from 'react';
import { storiesOf } from '@storybook/react-native';
import { ScrollView } from 'react-native-gesture-handler';
import StoryWrapper from '../../components/molecules/StoryWrapper';
import FormField from './FormField';

const heading = 'Green things';

const categories = [
  { category: 'fruit', description: 'Frukter' },
  { category: 'vegetable', description: 'Grönsaker' },
];

const items = [
  {
    category: 'fruit',
    title: 'Banana',
    formId: 'e366f250-c5a2-11ea-9e21-b7b32d0793c5',
  },
  {
    category: 'fruit',
    title: 'Pear',
    formId: 'e366f250-c5a2-11ea-9e21-b7b32d0793c5',
  },
  {
    category: 'vegetable',
    title: 'Carrot',
    formId: 'e366f250-c5a2-11ea-9e21-b7b32d0793c5',
  },
];

const radioChoices = [
  { displayText: 'Choice 1', value: '1' },
  { displayText: 'Choice 2', value: '2' },
  {
    displayText: 'Choice 3',
    value: '3',
  },
];

const DateFormField = () => {
  const [date, setDate] = useState({ 7: '' });
  return (
    <FormField
      id="7"
      label="Date input"
      labelLine="true"
      value={date[7]}
      onChange={v => setDate(v)}
      color="light"
      inputType="date"
    />
  );
};
const RadioGroupFormField = () => {
  const [value, setValue] = useState({ 8: '' });
  return (
    <FormField
      id="8"
      label="Radio group"
      labelLine
      choices={radioChoices}
      onChange={choice => setValue(choice)}
      value={value[8]}
      inputType="radioGroup"
    />
  );
};
storiesOf('Form Field input', module).add('Default', () => (
  <StoryWrapper>
    <ScrollView>
      <FormField
        id="1"
        label="Text input"
        color="light"
        placeholder="write something"
        inputType="text"
      />
      <FormField
        id="2"
        label="Text input, green"
        color="green"
        placeholder="write something else"
        inputType="text"
      />
      <FormField
        id="3"
        label="Number input"
        labelLine="false"
        color="red"
        placeholder="write a number..."
        inputType="number"
      />
      <FormField
        id="4"
        labelLine="false"
        color="red"
        placeholder="Look ma, no label!"
        inputType="text"
      />
      <FormField
        id="5"
        label="Checkbox input"
        labelLine="true"
        color="light"
        text="Do you feel it now?"
        inputType="checkbox"
        placeholder="Do you feel it now?"
      />
      <FormField
        id="6"
        label="Select input"
        labelLine="true"
        color="light"
        placeholder="Your car preference"
        inputType="select"
        items={[
          { label: 'Ferrari', value: 'ferrari' },
          { label: 'Buggati', value: 'buggati' },
          { label: 'Porsche', value: 'porsche' },
        ]}
      />
      <DateFormField />
      <RadioGroupFormField />
    </ScrollView>
  </StoryWrapper>
));
