import { actionTypes } from '../actions/CaseActions';

export const initialState = {
  cases: {},
  error: undefined,
};

export default function CaseReducer(state, action) {
  const { type, payload } = action;
  const newState = { ...state };
  switch (type) {
    case actionTypes.updateCase:
      newState.cases[payload.id] = payload;
      return newState;

    case actionTypes.createCase:
      newState.cases[payload.id] = payload;
      return newState;

    case actionTypes.deleteCase:
      newState.cases[payload] = undefined;
      return newState;

    case actionTypes.fetchCases:
      newState.cases = payload;
      return newState;

    case actionTypes.apiError:
      newState.error = payload;
      return newState;

    default:
      return state;
  }
}
