import { Case } from "../../types/Case";
import { Action, ActionTypes, State } from "../../types/CaseContext";

export const initialState: State = {
  cases: {},
  error: undefined,
};

export default function CaseReducer(state: State, action: Action): State {
  const { type, payload } = action;
  // here be dragons.... deep copy is needed, for some reason.
  const newState = JSON.parse(JSON.stringify(state));
  switch (type) {
    case ActionTypes.UPDATE_CASE:
      newState.cases[(payload as Case).id] = payload;
      return newState;

    case ActionTypes.CREATE_CASE:
      newState.cases[(payload as Case).id] = payload;
      return newState;

    case ActionTypes.DELETE_CASE:
      newState.cases[(payload as Case).id] = undefined;
      return newState;

    case ActionTypes.FETCH_CASES:
      newState.cases = payload;
      return newState;

    case ActionTypes.API_ERROR:
      newState.error = payload;
      return newState;

    default:
      return state;
  }
}
