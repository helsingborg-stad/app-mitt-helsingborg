import { actionTypes } from '../actions/CaseActions';

export const initialState = {};

export default function AuthReducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.updateCase:
      return {
        ...state,
        ...payload,
      };

    case actionTypes.createCase:
      return {
        ...state,
        ...payload,
      };

    case actionTypes.deleteCase:
      return {
        ...state,
        ...payload,
      };
    case actionTypes.fetchCases:
      return {
        ...state,
        ...payload,
      };

    default:
      return state;
  }
}
