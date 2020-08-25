import React, { useContext, useReducer, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import AuthContext from 'app/store/AuthContext';
import CaseReducer, { initialState as defaultInitialState } from './reducers/CaseReducer';
import {
  updateCase as update,
  createCase as create,
  deleteCase as delCase,
  fetchCases as fetch,
} from './actions/CaseActions';

// const CaseContext2 = React.createContext();

const CaseState = React.createContext();
const CaseDispatch = React.createContext();

function CaseProvider2({ children, initialState = defaultInitialState }) {
  const [cases, dispatch] = useReducer(CaseReducer, initialState);
  const { user } = useContext(AuthContext);

  async function createCase(formId, callback = response => {}) {
    dispatch(await create(formId, user, cases, callback));
  }

  async function updateCase(caseId, data, status, currentStep) {
    dispatch(await update(caseId, data, status, currentStep, user));
  }

  function getCase(caseId) {
    return cases[caseId];
  }

  async function deleteCase(caseId) {
    dispatch(await delCase(caseId));
  }

  const fetchCases = useCallback(
    async function loadCases(callback = () => {}) {
      dispatch(await fetch(user, callback));
    },
    [dispatch, user]
  );

  useEffect(() => {
    if (user) {
      fetchCases();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <CaseState.Provider value={{ cases, getCase }}>
      <CaseDispatch.Provider value={{ createCase, updateCase, deleteCase }}>
        {children}
      </CaseDispatch.Provider>
    </CaseState.Provider>
  );
}

CaseProvider2.propTypes = {
  children: PropTypes.node,
  initialState: PropTypes.shape({}),
};

CaseProvider2.defaultProps = {
  initialState: defaultInitialState,
};

export { CaseProvider2, CaseState, CaseDispatch };
