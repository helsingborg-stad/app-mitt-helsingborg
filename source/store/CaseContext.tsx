import React, { useContext, useReducer, useEffect } from "react";
import PropTypes from "prop-types";
import { getStoredSymmetricKey } from "../services/encryption/EncryptionHelper";
import { filterAsync } from "../helpers/Objects";
import { Case } from "../types/Case";
import { Form } from "../types/FormTypes";
import {
  State as ContextState,
  Dispatch,
  ProvidedState,
  CaseUpdate,
  PolledCaseResult,
  ActionTypes,
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
  const { user } = useContext(AuthContext);
  async function createCase(form: Form, callback: (newCase: Case) => void) {
    dispatch(await create(form, callback));
  }

  async function updateCase(
    updateData: Omit<CaseUpdate, "user">,
    callback: (updatedCase: Case) => void
  ) {
    const fullUpdateData: CaseUpdate = {
      ...updateData,
      user,
    };
    const updateResult = await update(fullUpdateData, callback);
    dispatch(updateResult);
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

  async function pollLoop(cases: Case[]): Promise<void> {
    const newCases = await cases.reduce(async (pollingCases, unsyncedCase) => {
      const polledCases = await pollingCases;

      const action = await pollCase(user, unsyncedCase);
      dispatch(action);

      const pollResult = action.payload as PolledCaseResult;
      if (!pollResult.synced) {
        return [...polledCases, pollResult.case];
      }

      return polledCases;
    }, Promise.resolve([] as Case[]));

    if (newCases.length > 0) {
      await pollLoop(newCases);
    }
  }

  const fetchCases = async () => {
    const fetchData = await fetch(user);
    dispatch(fetchData);

    const fetchPayload = fetchData.payload as Record<string, Case>;
    const fetchPayloadArray = Object.values(fetchPayload);
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
  };

  useEffect(() => {
    if (user) {
      fetchCases();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const providedState: ProvidedState = {
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
