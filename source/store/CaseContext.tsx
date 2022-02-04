import React, {
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
} from "react";
import PropTypes from "prop-types";
import {
  State as ContextState,
  Dispatch,
  ActionTypes,
} from "../types/CaseContext";
import AuthContext from "./AuthContext";
import CaseReducer, {
  initialState as defaultInitialState,
} from "./reducers/CaseReducer";

import USER_AUTH_STATE from "app/types/UserAuthTypes";
import useCaseState from "./CaseContext/CaseContextHooks";
import { CurrentRenderContext } from "@react-navigation/native";

const CaseState = React.createContext<ContextState>(defaultInitialState);
const CaseDispatch = React.createContext<Dispatch>({
  createCase: () => undefined,
  updateCase: () => undefined,
  deleteCase: () => undefined,
});

/**
 * An array that defines the different types of cases there is in the application.
 * Note: Not sure if this is the right place to save these params, but will do for know.
 * */
export const caseTypes = [
  {
    name: "Ekonomiskt Bistånd",
    formTypes: ["EKB-recurring", "EKB-completion", "EKB-new"],
    icon: "ICON_EKB",
    navigateTo: "CaseSummary",
  },
];

interface CaseProviderProps {
  initialState: ContextState;
  children?: React.ReactNode;
}

function CaseProvider({
  children,
  initialState = defaultInitialState,
}: CaseProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(CaseReducer, initialState);
  const { user, userAuthState } = useContext(AuthContext);
  const isSignedIn = userAuthState === USER_AUTH_STATE.SIGNED_IN;

  const {
    createContextState,
    createDispatch,
    createNullContextState,
    createNullDispatch,
  } = useCaseState(state, user, dispatch);

  const reset = () =>
    dispatch({ type: ActionTypes.RESET, payload: initialState });

  const lockDown = !isSignedIn;
  const providedState = lockDown
    ? createNullContextState()
    : createContextState();
  const providedDispatch = lockDown ? createNullDispatch() : createDispatch();

  useEffect(() => {
    if (user) {
      void providedState.fetchCases?.();
    }
    if (lockDown) {
      reset();
    }
  }, [user, lockDown]);

  return (
    <CaseState.Provider value={providedState}>
      <CaseDispatch.Provider value={providedDispatch}>
        {children}
      </CaseDispatch.Provider>
    </CaseState.Provider>
  );
}

CaseProvider.propTypes = {
  children: PropTypes.node,
  initialState: PropTypes.shape({}),
};

CaseProvider.defaultProps = {
  initialState: defaultInitialState,
};

export { CaseProvider, CaseState, CaseDispatch };
