import React from 'react';

import { render, fireEvent, cleanup } from 'test-utils';
import Form from 'source/containers/Form';

import mockJson from 'source/assets/mock/mock-form-ekb.json';

const mockForm = {
  submitted: false,
  counter: 1,
  steps: mockJson.steps,
  user: {
    firstName: 'Gandalf Ståhl',
  },
  formAnswers: {},
  currentStep: 1,
};

describe('Form Component', () => {
  const mockOnStart = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockUpdateCaseInContext = jest.fn();

  const { getByText } = render(
    <Form
      steps={mockForm.steps}
      startAt={mockForm.currentStep || 1}
      firstName={mockForm.user.firstName}
      onClose={mockOnClose}
      onStart={mockOnStart}
      onSubmit={mockOnSubmit}
      initialAnswers={{}}
      updateCaseInContext={mockUpdateCaseInContext}
    />
  );

  test('It should start the form', () => {
    // This requires the first step to have a submit button with the text 'Ja, jag är redo'
    const submitButton = getByText('Ja, jag är redo');
    fireEvent.press(submitButton);
    expect(mockOnStart).toBeCalled();
  });

  // TODO: Test each input/question component within form
});
