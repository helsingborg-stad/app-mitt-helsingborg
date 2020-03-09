import { reducer } from 'app/store/AuthContext';

test('dispatch:SIGN_IN', async () => {
  let state = {};

  state = reducer(state, {
    type: 'SIGN_IN',
    token: '123',
    user: {
      id: 1,
    },
  });

  expect(state).toEqual({ authStatus: 'resolved', token: '123', user: { id: 1 } });
});

test('dispatch:SIGN_OUT', async () => {
  let state = {};

  state = reducer(state, {
    type: 'SIGN_OUT',
  });

  expect(state).toEqual({ authStatus: 'idle', token: null, user: {} });
});

test('dispatch:PENDING', async () => {
  let state = {};

  state = reducer(state, {
    type: 'PENDING',
  });

  expect(state).toEqual({ authStatus: 'pending' });
});

test('dispatch:ERROR', async () => {
  let state = {};

  state = reducer(state, {
    type: 'ERROR',
    error: {},
  });

  expect(state).toEqual({ authStatus: 'rejected', error: {} });
});
