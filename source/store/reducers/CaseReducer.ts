import { Case } from "../../types/Case";
import { Action, State } from "../../types/CaseContext";
import { actionTypes } from "../actions/CaseActions";

export const initialState: State = {
  cases: {},
  error: undefined,
};

export default function CaseReducer(state: State, action: Action): State {
  const { type, payload } = action;
  // here be dragons.... deep copy is needed, for some reason.
  const newState = JSON.parse(JSON.stringify(state));
  switch (type) {
    case actionTypes.updateCase:
      newState.cases[(payload as Case).id] = payload;
      return newState;

    case actionTypes.createCase:
      newState.cases[(payload as Case).id] = payload;
      return newState;

    case actionTypes.deleteCase:
      newState.cases[(payload as Case).id] = undefined;
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
