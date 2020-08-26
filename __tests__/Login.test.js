import React from 'react';
import axios from 'axios';

import { render, fireEvent, act, waitFor } from 'test-utils';
import { Alert } from 'react-native';

import LoginScreen from 'source/screens/LoginScreen';
import MockNavigator from 'app/navigator/MockNavigator';

jest.mock('axios');

it('Validates personalnumber and triggers an alert', async () => {
  // TODO: Mock axios bankid requests
  const spy = jest.spyOn(Alert, 'alert');
  const { getByPlaceholderText, getByText } = render(<MockNavigator component={LoginScreen} />);

  fireEvent.changeText(getByPlaceholderText('ÅÅÅÅMMDDXXXX'), '123');
  fireEvent.press(getByText('Logga in med mobilt BankID'));

  await waitFor(() => expect(spy).toHaveBeenCalled());
});

it('Returns to login screen when cancelling ', async () => {
  const { getByPlaceholderText, getByText, debug } = render(
    <MockNavigator component={LoginScreen} />
  );

  fireEvent.changeText(getByPlaceholderText('ÅÅÅÅMMDDXXXX'), '199803312389');
  fireEvent.press(getByText('Logga in med mobilt BankID'));

  // TODO: Mock axios bankid requests
  axios.request(async params => {
    console.log(params);

    return Promise.resolve();
  });

  await act(async () => fireEvent.press(getByText('Avbryt')));
  expect(getByPlaceholderText('ÅÅÅÅMMDDXXXX')).toBeTruthy();
});

// TODO: it('Sign in user after successfull authentication')
