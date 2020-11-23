import React, { useContext, useReducer, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import AuthContext from 'app/store/AuthContext';
import CaseReducer, { initialState as defaultInitialState } from './reducers/CaseReducer';
import {
  updateCase as update,
  createCase as create,
  deleteCase as remove,
  fetchCases as fetch,
} from './actions/CaseActions';

const CaseState = React.createContext();
const CaseDispatch = React.createContext();

/**
 * An array that defines the different types of cases there is in the application.
 * Note: Not sure if this is the right place to save these params, but will do for know.
 * */
export const caseTypes = [
  {
    name: 'Ekonomiskt Bistånd',
    formTypes: ['EKB-recurring'],
    icon: 'ICON_EKB',
    navigateTo: 'CaseSummary',
  },
];

/** An enum for describing the state of the user with respect to a given case type. */
export const caseStatus = {
  unfinished: 'UNFINISHED',
  unfinishedNoCompleted: 'UNFINISHED_NO_COMPLETED',
  recentlyCompleted: 'RECENTLY_COMPLETED',
  untouched: 'UNTOUCHED',
  onlyOldCases: 'ONLY_OLD_CASES',
};

const oldCaseLimit = 4 * 30 * 24 * 60 * 60 * 1000; // cases older than 4 months are classified as old.

function CaseProvider({ children, initialState = defaultInitialState }) {
  const [state, dispatch] = useReducer(CaseReducer, initialState);
  const { user } = useContext(AuthContext);
  // console.log('reducer state', state);
  async function createCase(form, callback = response => {}) {
    dispatch(await create(form, user, Object.values(state.cases), callback));
  }

  async function updateCase(caseId, data, status, currentPosition, form) {
    dispatch(await update(caseId, data, status, currentPosition, form));
  }

  function getCase(caseId) {
    return state?.cases[caseId];
  }

  /**
   * This functions retrives cases based on formIds
   * @param {array} formIds an array of form ids.
   * @param {[cases]} cases array of case objects.
   * @returns {[status, latestCase, relevantCases]}
   */
  function getCasesByFormIds(formIds) {
    let latestUpdated = 0;
    let latestCase;
    const relevantCases = [];

    Object.values(state.cases).forEach(c => {
      if (formIds.includes(c.formId)) {
        relevantCases.push(c);
        if (c.updatedAt > latestUpdated) {
          latestUpdated = c.updatedAt;
          latestCase = c;
        }
      }
    });

    if (latestUpdated === 0) {
      return [caseStatus.untouched, undefined, relevantCases];
    }
    if (latestCase.status === 'ongoing' && relevantCases.length === 1) {
      return [caseStatus.unfinishedNoCompleted, latestCase, relevantCases];
    }
    if (latestCase.status === 'ongoing') {
      return [caseStatus.unfinished, latestCase, relevantCases];
    }
    if (latestCase.status === 'submitted') {
      if (Date.now() - latestUpdated > oldCaseLimit) {
        return [caseStatus.onlyOldCases, latestCase, relevantCases];
      }
      return [caseStatus.recentlyCompleted, latestCase, relevantCases];
    }
  }

  async function deleteCase(caseId) {
    dispatch(remove(caseId));
  }

  const fetchCases = useCallback(
    async function loadCases(callback = () => {}) {
      dispatch(await fetch(callback));
    },
    [dispatch]
  );

  useEffect(() => {
    if (user) {
      fetchCases();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <CaseState.Provider value={{ cases: state.cases, getCase, getCasesByFormIds }}>
      <CaseDispatch.Provider value={{ createCase, updateCase, deleteCase }}>
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
