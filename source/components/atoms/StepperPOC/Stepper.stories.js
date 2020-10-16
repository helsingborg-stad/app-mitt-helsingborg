import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../../molecules/StoryWrapper';
import Form from '../../../containers/Form/Form';

<<<<<<< HEAD
// This matrix describes how the steps are connected.
// The way to read it is that m[step1][step2] describes the connection between
// step1 to step2, i.e. if the corresponding element is none, they are not connected,
// if it's next, they follow each other sequentialy, and if it's down, it means step2
// is a child step of step1, and so on.
=======
>>>>>>> 2f8b2a3... Working POC of form navigation logic.
const connectivityMatrix = [
  ['none', 'next', 'none', 'down', 'none', 'none'],
  ['back', 'none', 'next', 'none', 'down', 'none'],
  ['none', 'back', 'none', 'none', 'none', 'none'],
  ['up', 'none', 'none', 'none', 'none', 'next'],
  ['none', 'up', 'none', 'none', 'none', 'none'],
  ['up', 'none', 'none', 'back', 'none', 'none'],
];

const steps = [
  {
    id: '1',
    title: 'Steg 1',
    description: 'Det första steget i formuläret som användaren ser',
    group: 'Story',
    actions: [
      {
        type: 'next',
        label: 'Nästa',
      },
    ],
    questions: [
      {
<<<<<<< HEAD
        inputType: 'navigationButton',
        description: 'test button',
        id: 'testButton1',
        navigationType: { type: 'navigateDown', stepId: '4' },
=======
        inputType: 'button',
        description: 'test button',
        id: 'testButton1',
        type: { type: 'navigateDown', stepId: '4' },
>>>>>>> 2f8b2a3... Working POC of form navigation logic.
        text: 'To Step 4',
        color: 'blue',
      },
    ],
  },
  {
    id: '2',
    title: 'Steg 2',
    description: 'Andra steget, som uppdateras',
    group: 'Story',
    actions: [
      {
        type: 'next',
        label: 'Nästa',
      },
    ],
    questions: [
      {
        inputType: 'checkbox',
        description: 'how awesome is this?',
        id: 'check1',
        text: 'how awesome is this?',
        color: 'green',
      },
      {
<<<<<<< HEAD
        inputType: 'navigationButton',
        description: 'test button',
        id: 'testButton2',
        navigationType: { type: 'navigateDown', stepId: '5' },
=======
        inputType: 'button',
        description: 'test button',
        id: 'testButton2',
        type: { type: 'navigateDown', stepId: '5' },
>>>>>>> 2f8b2a3... Working POC of form navigation logic.
        text: 'navigate down to step 5',
        color: 'green',
      },
    ],
  },
  {
    id: '3',
    title: 'Steg 3',
    description: 'Tredje, sista steget',
    group: 'Story',
    actions: [
      {
        type: 'close',
        label: 'Stäng',
      },
    ],
    questions: [],
  },
  {
    id: '4',
    title: 'Steg 4',
    description: 'Understeg under steg 1',
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
    id: '5',
    title: 'Steg 5',
    description: 'Understeg under steg 2',
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
    id: '6',
    title: 'Steg 6',
    description: 'Fortsättning från steg 4',
    group: 'Story',
    actions: [
      {
        type: 'next',
        label: 'Nästa',
      },
    ],
    questions: [
      {
        inputType: 'text',
        description: 'test field',
        id: 'text1',
        text: 'navigate down to step 5',
        color: 'green',
      },
    ],
  },
];

<<<<<<< HEAD
storiesOf('Form Stepper POC', module).add('default', () => (
=======
storiesOf('New Stepper POC', module).add('default', () => (
>>>>>>> 2f8b2a3... Working POC of form navigation logic.
  <StoryWrapper>
    <Form
      steps={steps}
      startAt={0}
      connectivityMatrix={connectivityMatrix}
      initialAnswers={{}}
      onClose={() => {
        console.log('tried to close the form!');
      }}
      status="ongoing"
    />
  </StoryWrapper>
));
