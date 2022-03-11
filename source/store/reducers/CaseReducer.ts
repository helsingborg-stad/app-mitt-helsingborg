import { deepCopy } from "../../helpers/Objects";
import { Case } from "../../types/Case";
import { Action, ActionTypes, State } from "../../types/CaseContext";

export const initialState: State = {
  cases: {},
  error: undefined,
};

export default function CaseReducer(state: State, action: Action): State {
  const { type, payload } = action;
  const newState = deepCopy(state);
  switch (type) {
    case ActionTypes.UPDATE_CASE: {
      const casePayload = payload as Case;
      newState.cases[casePayload.id] = casePayload;
      return newState;
    }

    case ActionTypes.CREATE_CASE: {
      const casePayload = payload as Case;
      newState.cases[casePayload.id] = casePayload;
      return newState;
    }

    case ActionTypes.DELETE_CASE: {
      const casePayload = payload as Case;
      delete newState.cases[casePayload.id];
      return newState;
    }

    case ActionTypes.FETCH_CASES:
      newState.cases = payload as Record<string, Case>;
      return newState;

    case ActionTypes.API_ERROR:
      newState.error = payload;
      return newState;

    case ActionTypes.RESET:
      return { ...initialState };

    default:
      return state;
  }
}
