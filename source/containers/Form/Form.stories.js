import React from 'react';
import { storiesOf } from '@storybook/react-native';
import UserMockData from 'app/assets/mock/user';
import StoryWrapper from '../../components/molecules/StoryWrapper';
import Form from './Form';

const DynamicTitleStoryData = {
  steps: [
    {
      title: 'Hello #firstName!',
      description:
        'The value #firstName in the step title is changed to the first name of the current user',
      group: 'Ansökan',
      actions: [
        {
          type: 'next',
          label: 'Ja, starta ansökan',
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

const userData = {
  givenName: 'Fake Name',
};

storiesOf('Form', module)
  .add('Default', () => (
    <StoryWrapper>
      <Form steps={DefaultStoryData.steps} user={userData} />
    </StoryWrapper>
  ))
  .add('Dynamic Title', () => (
    <StoryWrapper>
      <Form steps={DynamicTitleStoryData.steps} user={userData} />
    </StoryWrapper>
  ));
