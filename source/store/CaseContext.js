import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import casesMock from '../assets/mock/cases';

const CaseContext = React.createContext();

export const CaseConsumer = CaseContext.Consumer;

export function CaseProvider({ children }) {
  const [cases, setCases] = useState([]);
  const [fetching, setFetcing] = useState(false);

  useEffect(() => {
    // Todo Replace with api request towards AWS.
    setFetcing(true);

    setTimeout(() => {
      setCases(casesMock);
      setFetcing(false);
    }, 200);
  }, [cases]);

  const getCase = caseId => {
    const item = cases.find(c => c.id === caseId);
    console.log(item);
    return item;
  };

  return (
    <CaseContext.Provider value={{ cases, getCase, fetching }}>{children}</CaseContext.Provider>
  );
}

CaseProvider.propTypes = {
  /**
   * Child nodes/elements.
   */
  children: PropTypes.node,
};

export default CaseContext;
