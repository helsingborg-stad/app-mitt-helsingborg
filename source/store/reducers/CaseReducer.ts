import { deepCopyViaJson } from "../../helpers/Objects";
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
  const newState = deepCopyViaJson(state);
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
      newState.cases[updatedCase.id] = updatedCase;
      return newState;
    }

    case ActionTypes.SET_POLLING_CASES: {
      newState.isPolling = true;
      newState.casesToPoll = payload as Case[];
      return newState;
    }

    case ActionTypes.SET_POLLING_DONE: {
      newState.isPolling = false;
      return newState;
    }

    case ActionTypes.API_ERROR:
      newState.error = payload;
      return newState;

    default:
      return state;
  }
}
