import { useCallback } from "react";
import {
  getStoredSymmetricKey,
  UserInterface,
} from "../../services/encryption/EncryptionHelper";
import { Case } from "../../types/Case";
import {
  Action,
  ActionTypes,
  CaseUpdate,
  Dispatch,
  PolledCaseResult,
  State,
} from "../../types/CaseContext";
import { Form } from "../../types/FormTypes";

import {
  updateCase as update,
  createCase as create,
  deleteCase as remove,
  fetchCases as fetch,
  pollCase,
} from "../actions/CaseActions";
import { replaceCaseItemText } from "../../containers/Form/hooks/textReplacement";
import { filterAsync } from "../../helpers/Objects";

interface CaseContextController {
  createNullContextState: () => State;
  createNullDispatch: () => Dispatch;
  createContextState: () => State;
  createDispatch: () => Dispatch;
}

const useCaseState = (
  state: State,
  user: UserInterface,
  dispatch: React.Dispatch<Action>
): CaseContextController => {
  const checkSymmetricKeyExistsForCase = useCallback(
    async (caseData: Case): Promise<boolean> => {
      const currentForm = caseData.forms[caseData.currentFormId];
      const key = await getStoredSymmetricKey(currentForm);
      return key !== null;
    },
    []
  );

  const checkSymmetricKeyMissingForCase = useCallback(
    async (caseData: Case): Promise<boolean> => {
      const exists = await checkSymmetricKeyExistsForCase(caseData);
      return !exists;
    },
    [checkSymmetricKeyExistsForCase]
  );

  const caseRequiresSync = useCallback(
    async (caseData: Case): Promise<boolean> => {
      const currentForm = caseData.forms[caseData.currentFormId];
      const usesSymmetricKey = !!currentForm.encryption.symmetricKeyName;

      if (usesSymmetricKey) {
        return checkSymmetricKeyMissingForCase(caseData);
      }
      return false;
    },
    [checkSymmetricKeyMissingForCase]
  );

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
    [dispatch, user]
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
  }, [caseRequiresSync, dispatch, pollLoop, state.isPolling, user]);

  const createContextState = () => ({
    ...state,
    getCase,
    getCasesByFormIds,
    fetchCases,
  });
  const createDispatch = () => ({
    createCase,
    updateCase,
    deleteCase,
  });

  const createNullContextState = (): State => ({
    cases: {},
    error: undefined,
    isPolling: false,
    casesToPoll: [],
    getCase: () => undefined,
    getCasesByFormIds: () => [],
    fetchCases: async () => undefined,
  });
  const createNullDispatch = (): Dispatch => ({
    createCase: () => undefined,
    updateCase: () => undefined,
    deleteCase: () => undefined,
  });
  return {
    createNullDispatch,
    createNullContextState,
    createContextState,
    createDispatch,
  };
};

export default useCaseState;
