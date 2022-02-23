import React, {
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import { getStoredSymmetricKey } from "../services/encryption/EncryptionHelper";
import { filterAsync } from "../helpers/Objects";
import { Case } from "../types/Case";
import { Form } from "../types/FormTypes";
import USER_AUTH_STATE from "../types/UserAuthTypes";
import {
  State as ContextState,
  Dispatch,
  CaseUpdate,
  PolledCaseResult,
  ActionTypes,
  Action,
} from "../types/CaseContext";
import AuthContext from "./AuthContext";
import CaseReducer, {
  initialState as defaultInitialState,
} from "./reducers/CaseReducer";
import {
  updateCase as update,
  createCase as create,
  deleteCase as remove,
  fetchCases as fetch,
  pollCase,
} from "./actions/CaseActions";

import { replaceCaseItemText } from "../containers/Form/hooks/textReplacement";

const CaseState = React.createContext<ContextState>(defaultInitialState);
const CaseDispatch = React.createContext<Dispatch>({});

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

async function checkSymmetricKeyExistsForCase(caseData: Case) {
  const currentForm = caseData.forms[caseData.currentFormId];
  const key = await getStoredSymmetricKey(currentForm);
  return key !== null;
}

async function checkSymmetricKeyMissingForCase(caseData: Case) {
  const exists = await checkSymmetricKeyExistsForCase(caseData);
  return !exists;
}

async function caseRequiresSync(caseData: Case): Promise<boolean> {
  const currentForm = caseData.forms[caseData.currentFormId];
  const usesSymmetricKey = !!currentForm.encryption.symmetricKeyName;

  if (usesSymmetricKey) {
    return checkSymmetricKeyMissingForCase(caseData);
  }

  return false;
}
function CaseProvider({
  children,
  initialState = defaultInitialState,
}: CaseProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(CaseReducer, initialState);
  const { user, userAuthState } = useContext(AuthContext);

  const isSignedIn = useMemo(
    () => userAuthState === USER_AUTH_STATE.SIGNED_IN,
    [userAuthState]
  );

  async function createCase(form: Form, callback: (newCase: Case) => void) {
    dispatch(await create(form, callback));
  }

  async function updateCase(
    updateData: Omit<CaseUpdate, "user">,
    callback: (updatedCase: Case) => Promise<Action>
  ): Promise<Action> {
    const fullUpdateData: CaseUpdate = {
      ...updateData,
      user,
    };
    const updateResult = await update(fullUpdateData, callback);
    dispatch(updateResult);
    return updateResult;
  }

  function getCase(caseId: string): Case | undefined {
    return state?.cases[caseId];
  }

  /**
   * This functions retrives cases based on formIds
   * @param {array} formIds an array of form ids.
   * @returns {array}
   */
  function getCasesByFormIds(formIds: string[]): Case[] {
    const formCases: Case[] = [];
    Object.values(state.cases).forEach((c) => {
      if (formIds.includes(c.currentFormId)) {
        formCases.push(c);
      }
    });

    return formCases;
  }

  async function deleteCase(caseId: string) {
    dispatch(remove(caseId));
  }

  const pollLoop = useCallback(
    async (cases: Case[]): Promise<void> => {
      const newCases = await cases.reduce(
        async (pollingCases, unsyncedCase) => {
          const polledCases = await pollingCases;

          const action = await pollCase(user, unsyncedCase);
          dispatch(action);

          const pollResult = action.payload as PolledCaseResult;
          if (!pollResult.synced) {
            return [...polledCases, pollResult.case];
          }

          return polledCases;
        },
        Promise.resolve([] as Case[])
      );

      if (newCases.length > 0) {
        await pollLoop(newCases);
      }
    },
    [user]
  );

  const fetchCases = useCallback(async () => {
    const fetchData = await fetch(user);

    const rawPayload = fetchData.payload as Record<string, Case>;

    const textReplacedPayload: Record<string, Case> = Object.entries(
      rawPayload
    ).reduce(
      (previous, [key, value]) => ({
        ...previous,
        [key]: replaceCaseItemText(value),
      }),
      {}
    );

    dispatch({
      ...fetchData,
      payload: textReplacedPayload,
    });

    const fetchPayloadArray = Object.values(textReplacedPayload);
    const unsyncedCases = await filterAsync(
      fetchPayloadArray,
      caseRequiresSync
    );

    if (unsyncedCases.length > 0 && !state.isPolling) {
      dispatch({
        type: ActionTypes.SET_POLLING_CASES,
        payload: unsyncedCases,
      });

      await pollLoop(unsyncedCases);

      dispatch({
        type: ActionTypes.SET_POLLING_DONE,
      });
    }
  }, [pollLoop, state.isPolling, user]);

  useEffect(() => {
    if (isSignedIn && user !== null) {
      void fetchCases();
    }

    if (!isSignedIn) {
      dispatch({
        type: ActionTypes.RESET,
      });
    }
  }, [isSignedIn, user, fetchCases]);

  const providedState: ContextState = {
    ...state,
    getCase,
    getCasesByFormIds,
    fetchCases,
  };

  const providedDispatch: Dispatch = { createCase, updateCase, deleteCase };

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
