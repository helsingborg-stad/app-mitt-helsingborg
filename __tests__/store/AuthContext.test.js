import AuthReducer from 'app/store/reducers/AuthReducer';
import { actionTypes, loginSuccess, removeProfile } from 'app/store/actions/AuthActions';

const initialState = {};

test(`dispatch:${actionTypes.loginSuccess}`, async () => {
  const state = AuthReducer(initialState, loginSuccess());

  expect(state).toEqual({
    status: 'authResolved',
    isAuthenticated: true,
    orderRef: undefined,
    autoStartToken: undefined,
  });
});

test(`dispatch:${actionTypes.signSuccess}`, async () => {
  const state = AuthReducer(initialState, { type: actionTypes.signSuccess });

  expect(state).toEqual({
    status: 'signResolved',
    orderRef: undefined,
    autoStartToken: undefined,
  });
});

test(`dispatch:${actionTypes.loginFailure}`, async () => {
  const state = AuthReducer(initialState, { type: actionTypes.loginFailure });

  expect(state).toEqual({
    isAuthenticated: false,
    status: 'rejected',
    orderRef: undefined,
    autoStartToken: undefined,
  });
});

test(`dispatch:${actionTypes.signFailure}`, async () => {
  const state = AuthReducer(initialState, { type: actionTypes.signFailure });

  expect(state).toEqual({
    status: 'rejected',
    orderRef: undefined,
    autoStartToken: undefined,
  });
});

test(`dispatch:${actionTypes.addProfile}`, async () => {
  const payload = {
    data: 123,
  };

  const state = AuthReducer(initialState, { type: actionTypes.addProfile, payload });

  expect(state).toEqual({ user: { data: 123 } });
});

test(`dispatch:${actionTypes.removeProfile}`, async () => {
  const state = AuthReducer(initialState, removeProfile());

  expect(state).toEqual({ user: null });
});

test(`dispatch:${actionTypes.authStarted}`, async () => {
  const state = AuthReducer(initialState, { type: actionTypes.authStarted });

  expect(state).toEqual({ isAuthenticated: false });
});

test(`dispatch:${actionTypes.setStatus}`, async () => {
  const state = AuthReducer(initialState, { type: actionTypes.setStatus, status: 'idle' });

  expect(state).toEqual({ status: 'idle' });
});

test(`dispatch:${actionTypes.authError}`, async () => {
  const state = AuthReducer(initialState, {
    type: actionTypes.authError,
    payload: {
      error: 'some error',
    },
  });

  expect(state).toEqual({
    error: 'some error',
    status: 'rejected',
    isAuthenticated: false,
    user: null,
    orderRef: undefined,
    autoStartToken: undefined,
  });
});

test(`dispatch:${actionTypes.cancelOrder}`, async () => {
  const state = AuthReducer(initialState, {
    type: actionTypes.cancelOrder,
  });

  expect(state).toEqual({
    status: 'rejected',
    orderRef: undefined,
    autoStartToken: undefined,
  });
});

test(`dispatch:${actionTypes.setIsBankidInstalled}`, async () => {
  const state = AuthReducer(initialState, {
    type: actionTypes.setIsBankidInstalled,
    isBankidInstalled: true,
  });

  expect(state).toEqual({ isBankidInstalled: true });
});
