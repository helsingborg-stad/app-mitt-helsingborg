import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { post } from 'app/helpers/ApiRequest';
import AuthContext from 'app/store/AuthContext';
import casesMock from '../assets/mock/cases';

const CaseContext = React.createContext();

export const CaseConsumer = CaseContext.Consumer;

export function CaseProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [cases, setCases] = useState([]);
  const [fetching, setFetcing] = useState(false);

  useEffect(() => {
    // Todo Replace with api request towards AWS.
    setFetcing(true);

    setTimeout(() => {
      setCases(casesMock);
      setFetcing(false);
    }, 200);
  }, [user]);

  const getCase = caseId => {
    const item = cases.find(c => c.id === caseId);
    return item;
  };
  /**
   * Function for sending a post request towards the case api endpoint.
   * @param {obj} data a object consiting of case user inputs.
   */
  const createCase = data => {
    const body = {
      personalNumber: parseInt(user.personalNumber),
      status: 'ongoing',
      type: 'VIVA_CASE',
      data,
    };

    // TODO: Remove Auhtorization header when token authentication works as expected.
    post('/cases', JSON.stringify(body), {
      Authorization: parseInt(user.personalNumber),
    });
  };

  return (
    <CaseContext.Provider value={{ cases, getCase, createCase, fetching }}>
      {children}
    </CaseContext.Provider>
  );
}

CaseProvider.propTypes = {
  /**
   * Child nodes/elements.
   */
  children: PropTypes.node,
};

export default CaseContext;
