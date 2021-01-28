import React, { useContext, useReducer, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import AuthContext from './AuthContext';
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

export const statuses = {
  /**
   * Global statuses
   */
  notStarted: {
    name: 'Ej påbörjad',
    description: 'Ansökan är ej påbörjad.',
  },
  'active.ongoing': {
    name: 'Pågående',
    description:
      'Du har påbörjat en ansökan. Du kan öppna din ansökan och fortsätta där du slutade.',
  },
  'active.submitted': {
    name: 'Inskickad',
    description: 'Ansökan är inskickad.',
  },
  'active.processing': {
    name: 'Ansökan behandlas',
    description: 'Ditt ärende är mottaget och bearbetas.',
  },
  closed: {
    name: 'Avslutat',
    description: 'Ditt ärende är avslutat.',
  },
  /**
   * EKB specific statuses
   */
  'notStarted.ekb.open': {
    name: 'Öppen',
    description: 'Ansökan är öppen. Du kan nu söka ekonomiskt bistånd för perioden.',
  },
  'active.ekb.submitted': {
    name: 'Inskickad',
    description:
      'Ansökan är inskickad. Du kommer att få besked om ansökan när din handläggare har granskat och bedömt den.',
  },
  'active.ekb.completionRequired': {
    name: 'Stickprovskontroll',
    description:
      'Du måste komplettera din ansökan med bilder som visar dina utgifter och inkomster. Vi behöver din komplettering inom 4 dagar för att kunna betala ut pengar för perioden.',
  },
  'closed.ekb.approved': {
    name: 'Godkänd',
    description: 'Din ansökan är godkänd. Pengarna sätts in på ditt konto.',
  },
  'closed.ekb.partiallyApproved': {
    name: 'Delvis godkänd',
    description:
      'Delar av din ansökan är godkänd, men några av de utgifter du sökt för får du inte bistånd för. Pengarna för godkända utgifter sätts in på ditt konto.',
  },
  'closed.ekb.rejected': {
    name: 'Avslagen',
    description:
      'Din ansökan är inte godkänd och du kommer inte att få någon utbetalning. Vill du överklaga beslutet lämnar du en skriftlig motivering med e-post eller brev till din handläggare.',
  },
  'closed.ekb.completionRejected': {
    name: 'Avslagen',
    description:
      'Din ansökan är inte godkänd eftersom vi saknar stickprov för perioden. Därför kan vi inte gå vidare och godkänna din ansökan.',
  },
};

function CaseProvider({ children, initialState = defaultInitialState }) {
  const [state, dispatch] = useReducer(CaseReducer, initialState);
  const { user } = useContext(AuthContext);
  async function createCase(form, callback = (response) => {}) {
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
   * @returns {array}
   */
  function getCasesByFormIds(formIds) {
    const formCases = [];
    Object.values(state.cases).forEach((c) => {
      if (formIds.includes(c.formId)) {
        formCases.push(c);
      }
    });

    return formCases;
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
