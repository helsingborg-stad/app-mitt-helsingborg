import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../../components/molecules/StoryWrapper';
import Form from './Form';

const DynamicTitleStoryData = {
  steps: [
    {
      title: 'Steg 1',
      description: 'Det första steget i formuläret som användaren ser',
      group: 'Story',
      actions: [
        {
          type: 'next',
          label: 'Nästa',
        },
      ],
      fields: [],
    },
    {
      title: 'Steg 2',
      description: 'Det andra steget i formuläret som användaren ser',
      group: 'Story',
      actions: [
        {
          type: 'next',
          label: 'Nästa',
        },
      ],
      fields: [],
    },
    {
      title: 'Steg 3',
      description: 'Det tredje och sista steget i formuläret som användaren ser',
      group: 'Story',
      actions: [
        {
          type: 'next',
          label: 'Nästa',
        },
      ],
      fields: [],
    },
  ],
};
const DefaultStoryData = {
  steps: [
    {
      title: 'A step title!',
      description: 'A step is used to divied fields/questions into sections in a form.',
      group: 'Ansökan',
      actions: [
        {
          type: 'next',
          label: 'Go to next step',
        },
      ],
      fields: [],
    },
  ],
};

storiesOf('Form', module)
  .add('Default', () => (
    <StoryWrapper>
      <Form steps={DefaultStoryData.steps} firstName="FakeName" />
    </StoryWrapper>
  ))
  .add('Dynamic Title', () => (
    <StoryWrapper>
      <Form steps={DynamicTitleStoryData.steps} firstName="FakeName" />
    </StoryWrapper>
  ));
