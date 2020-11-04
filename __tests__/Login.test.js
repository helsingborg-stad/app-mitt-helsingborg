import React from 'react';
import axios from 'axios';

import { render, fireEvent, act, waitFor } from 'test-utils';
import { Alert } from 'react-native';

import LoginScreen from 'source/screens/LoginScreen';
import MockNavigator from 'app/navigator/MockNavigator';

import MockAdapter from 'axios-mock-adapter';

jest.mock('jwt-decode', () => () => ({
  exp: 123,
}));

jest.mock('react-native-network-info');

jest.mock('../source/helpers/UrlHelper.js', () => ({
  ...jest.requireActual('../source/helpers/UrlHelper.js'),
  canOpenUrl: jest.fn().mockReturnValue(false),
}));

const mock = new MockAdapter(axios);

mock.onPost('/auth/bankid/auth?apikey=').reply(200, {
  success: true,
  data: {
    attributes: {
      orderRef: 'theOrderRef',
      autoStartToken: 'theAutoStartToken',
    },
  },
});

mock.onPost('/auth/bankid/collect?apikey=').reply(200, {
  success: true,
  data: {
    attributes: {
      completionData: {
        user: {
          personalNumber: '199803312389',
        },
      },
    },
  },
});

mock.onPost('/auth/token?apikey=').reply(200, {
  success: true,
  data: {
    attributes: {
      token: '123',
    },
  },
});

it('Navigates to start screen after successfull authentication', async () => {
  const { getByPlaceholderText, getByText } = render(<MockNavigator component={LoginScreen} />);

  fireEvent.changeText(getByPlaceholderText('ÅÅÅÅMMDDXXXX'), '199803312389');
  fireEvent.press(getByText('Logga in med mobilt BankID'));

  await act(async () => {});

  expect(getByText('Welcome to the start screen')).toBeTruthy();
});

it('Returns to login screen when user press the cancel button during an on-going auth', async () => {
  const { getByPlaceholderText, getByText } = render(<MockNavigator component={LoginScreen} />);

  fireEvent.changeText(getByPlaceholderText('ÅÅÅÅMMDDXXXX'), '199803312389');
  fireEvent.press(getByText('Logga in med mobilt BankID'));

  await act(async () => fireEvent.press(getByText('Avbryt')));

  expect(getByPlaceholderText('ÅÅÅÅMMDDXXXX')).toBeTruthy();
});

it('Triggers an alert when user personalnumber is incorrect format', async () => {
  const spy = jest.spyOn(Alert, 'alert');
  const { getByPlaceholderText, getByText } = render(<MockNavigator component={LoginScreen} />);

  fireEvent.changeText(getByPlaceholderText('ÅÅÅÅMMDDXXXX'), '123');
  fireEvent.press(getByText('Logga in med mobilt BankID'));

  await waitFor(() => expect(spy).toHaveBeenCalled());
});
