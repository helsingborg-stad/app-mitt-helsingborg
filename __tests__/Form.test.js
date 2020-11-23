import React from 'react';

import { render, fireEvent, act } from 'test-utils';
import Form from 'source/containers/Form';

it('Starts the form and moves to the next step', async () => {
  const mockFn = jest.fn();
  const mockForm = {
    submitted: false,
    counter: 1,
    steps: [
      {
        id: '1bc83374-2e10-4244-94fa-8333db0d6b08',
        title: 'Step one',
        description: 'Lorem',
        actions: [
          {
            type: 'start',
            color: 'blue',
            label: 'Ja, jag är redo',
          },
          {
            type: 'close',
            color: 'orange',
            label: 'Nej, jag väntar',
          },
        ],
        show: true,
        group: 'Group one',
      },
      {
        id: 'fb031655-a27b-444f-9671-4794f054fdf5',
        title: 'Step two',
        description: 'Lorem',
        actions: [
          {
            type: 'next',
            color: 'green',
            label: 'Ja, allt stämmer',
          },
        ],
        show: true,
        group: 'Group Two',
      },
    ],
    user: {
      firstName: 'Gandalf Ståhl',
    },
    formAnswers: {},
    currentStep: {
      index: 0,
      level: 0,
      currentMainStep: 1,
      currentMainStepIndex: 0,
    },
  };

  const { getByText, findByText } = render(
    <Form
      steps={mockForm.steps}
      initialPosition={mockForm.currentStep}
      firstName={mockForm.user.firstName}
      onClose={mockFn}
      onStart={mockFn}
      onSubmit={mockFn}
      initialAnswers={{}}
      updateCaseInContext={mockFn}
    />
  );

  // await sideeffects to avoid warning
  await act(async () => {});

  const submitButton = getByText('Ja, jag är redo');
  fireEvent.press(submitButton);

  expect(getByText('Ja, allt stämmer')).toBeTruthy();
  expect(mockFn).toBeCalled();
});
