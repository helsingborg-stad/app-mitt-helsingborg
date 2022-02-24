import { deepCopy } from "../../helpers/Objects";
import { Case } from "../../types/Case";
import {
  Action,
  ActionTypes,
  PolledCaseResult,
  State,
} from "../../types/CaseContext";

export const initialState: State = {
  cases: {},
  error: undefined,
  isPolling: false,
  casesToPoll: [],
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

    case ActionTypes.POLL_CASE: {
      const polledPayload = payload as PolledCaseResult;
      const updatedCase = polledPayload.case;
      if (newState.cases[updatedCase.id] !== undefined) {
        newState.cases[updatedCase.id] = updatedCase;
      }
      return newState;
    }

    case ActionTypes.SET_POLLING_CASES: {
      newState.casesToPoll = payload as Case[];
      return newState;
    }

    case ActionTypes.SET_IS_POLLING: {
      newState.isPolling = payload as boolean;
      return newState;
    }

    case ActionTypes.API_ERROR:
      newState.error = payload;
      return newState;

    case ActionTypes.RESET:
      return { ...initialState };

    default:
      return state;
  }
}
