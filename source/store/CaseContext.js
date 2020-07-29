import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { get, post, put } from 'app/helpers/ApiRequest';
import AuthContext from 'app/store/AuthContext';
import casesMock from '../assets/mock/cases';

const CaseContext = React.createContext();

export const CaseConsumer = CaseContext.Consumer;

export function CaseProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [cases, setCases] = useState([]);
  const [currentCase, setCurrentCase] = useState({ data: {} });
  const [fetching, setFetching] = useState(false);

  /**
   * Function to load the latest updated case. This is a temporary fix so that we don't have to build
   * too much other logic about how to choose a case.
   */
  const findLatestCase = cases => {
    if (cases.length > 0) {
      cases.sort((c1, c2) => c2.attributes.updatedAt - c1.attributes.updatedAt);
      console.log('Latest case:');
      console.log(cases[0]);
      return cases[0];
    }
    return null;
  };

  useEffect(() => {
    if (user) {
      setFetching(true);

      get('/cases', undefined, user.personalNumber).then(response => {
        setCases(response.data.data);
        setCurrentCase(findLatestCase(response.data.data));
        setFetching(false);
      });
    }
  }, [user]);

  const getCase = caseId => cases.find(c => c.id === caseId);

  /**
   * Function for sending a post request towards the case api endpoint.
   * Can be used with  callback if something is to be done with the response object.
   * @param {obj} data a object consiting of case user inputs.
   * @param {string} formId the id of the form corresponding to the new case
   * @param {func} callback what should happen after the new case have been created.
   */
  const createCase = async (data, formId, callback = response => {}) => {
    const body = {
      personalNumber: parseInt(user.personalNumber),
      status: 'completed',
      type: 'VIVA_CASE',
      data: data || {},
      formId,
    };
    // TODO: Remove Auhtorization header when token authentication works as expected.
    post('/cases', JSON.stringify(body), {
      Authorization: parseInt(user.personalNumber),
    })
      .then(response => {
        setCurrentCase(response.data.data);
        setFetching(false);
        return response.data.data;
      })
      .then(newCase => callback(newCase));
  };

  /**
   * Function to refresh the loaded cases from the backend.
   * Currently it also sets the currentCase.
   * Pass a callback in order to guarantee that the loading of
   * information happens before the updated values are used.
   */
  const updateCases = async callback => {
    console.log('UPDATE CASES!!');
    setFetching(true);
    get('/cases', undefined, user.personalNumber)
      .then(response => {
        setCases(response.data.data);
        setCurrentCase(findLatestCase(response.data.data));
        setFetching(false);
      })
      .then(response => callback(response));
  };

  /**
   * Function for sending a put request towards the case api endpoint, updating the currently active case
   * @param {obj} data a object consiting of case user inputs.
   */
  const updateCurrentCase = (data, status) => {
    const body = {
      status,
      data,
    };
    // TODO: Remove Auhtorization header when token authentication works as expected.
    console.log('sending db put request with data:');
    console.log(data);
    console.log(status);
    put(`/cases/${currentCase.id}`, JSON.stringify(body), {
      Authorization: parseInt(user.personalNumber),
    });
  };

  return (
    <CaseContext.Provider
      value={{
        cases,
        currentCase,
        getCase,
        createCase,
        updateCurrentCase,
        updateCases,
        fetching,
      }}
    >
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
