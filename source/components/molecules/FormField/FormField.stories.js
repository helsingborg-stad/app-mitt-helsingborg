import React, { useState } from 'react';
import { Text } from 'source/components/atoms';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../StoryWrapper';
import FormField from './FormField';

const heading = 'Green things';

const categories = {
  fruit: 'Frukter',
  vegetable: 'Grönsaker',
};

const items = [
  {
    category: 'fruit',
    component: <Text>Banana!</Text>,
    title: 'Banana',
    formId: 'e366f250-c5a2-11ea-9e21-b7b32d0793c5',
  },
  {
    category: 'fruit',
    component: <Text>Pear!</Text>,
    title: 'Pear',
    formId: 'e366f250-c5a2-11ea-9e21-b7b32d0793c5',
  },
  {
    category: 'vegetable',
    component: <Text>Carrot!</Text>,
    title: 'Carrot',
    formId: 'e366f250-c5a2-11ea-9e21-b7b32d0793c5',
  },
];

const SubstepListFormField = props => {
  const [answers, setAnswers] = useState({});

  const onChange = values => {
    const newAnswers = JSON.parse(JSON.stringify(answers));
    Object.keys(values).forEach(key => {
      newAnswers[key] = values[key];
    });
    setAnswers(newAnswers);
  };

  return (
    <StoryWrapper>
      <FormField
        id="1"
        inputType="substepList"
        heading={heading}
        onChange={onChange}
        value={answers[1] || ''}
        categories={categories}
        items={items}
      />
      <FormField
        id="1"
        inputType="substepListSummary"
        heading="Summary"
        onChange={onChange}
        value={answers[1] || ''}
        categories={categories}
        items={items}
      />
    </StoryWrapper>
  );
};

storiesOf('Form Field input', module)
  .add('Default', () => (
    <StoryWrapper>
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
    </StoryWrapper>
  ))
  .add('Substep List', () => (
    <StoryWrapper>
      <SubstepListFormField />
    </StoryWrapper>
  ));
