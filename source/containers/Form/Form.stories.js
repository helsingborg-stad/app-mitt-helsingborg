import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../../components/molecules/StoryWrapper';
import Form from './Form';

const formData = {
  steps: [
    {
      title: 'Vill du ansöka om Ekonomiskt bistånd igen?',
      description:
        'Du kommer behöva ange inkomster, utgifter och kontrollera dina boende detaljer.',
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

storiesOf('Form', module).add('Default', () => (
  <StoryWrapper>
    <Form steps={formData.steps} />
  </StoryWrapper>
));
