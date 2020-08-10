import AuthReducer from 'app/store/reducers/AuthReducer';
import { actionTypes, loginSuccess, removeProfile } from 'app/store/actions/AuthActions';

const initialState = {};

test(`dispatch:${actionTypes.loginSuccess}`, async () => {
  const state = AuthReducer(initialState, loginSuccess());

  expect(state).toEqual({ isAuthorizing: false, isAuthenticated: true });
});

test(`dispatch:${actionTypes.loginFailure}`, async () => {
  const state = AuthReducer(initialState, { type: actionTypes.loginFailure });

  expect(state).toEqual({ isAuthenticated: false, isAuthorizing: false });
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

  expect(state).toEqual({ isAuthorizing: true, isAuthenticated: false });
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
    isAuthorizing: false,
    isAuthenticated: false,
    user: null,
  });
});

test(`dispatch:${actionTypes.authCanceled}`, async () => {
  const state = AuthReducer(initialState, {
    type: actionTypes.authCanceled,
  });

  expect(state).toEqual({
    isAuthorizing: false,
    isAuthenticated: false,
    user: null,
  });
});
