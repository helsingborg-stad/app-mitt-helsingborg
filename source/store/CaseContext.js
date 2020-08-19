import React, { useContext, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { get, post, put } from 'app/helpers/ApiRequest';
import AuthContext from 'app/store/AuthContext';

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
      const [latestCase] = cases.sort((c1, c2) => c2.updatedAt - c1.updatedAt);
      return latestCase;
    }
    return null;
  };

  /**
   * Function to refresh the loaded cases from the backend.
   * Pass a callback in order to guarantee that the loading of
   * information happens before the updated values are used.
   */
  const fetchCases = useCallback(
    async callback => {
      setFetching(true);
      get('/cases', undefined, user.personalNumber)
        .then(response => {
          if (response?.data?.data?.map) {
            const newCases = response.data.data.map(c => ({ id: c.id, ...c.attributes }));
            setCases(newCases);
            setFetching(false);
            return newCases;
          }
          return [];
        })
        .then(response => callback(response));
    },
    [user.personalNumber]
  );

  useEffect(() => {
    if (user) {
      fetchCases(response => {
        setCurrentCase(findLatestCase(response));
      });
    }
  }, [fetchCases, user]);

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
   * Function for sending a put request towards the case api endpoint, updating the currently active case
   * @param {obj} data a object consiting of case user inputs.
   */
  const updateCurrentCase = async (data, status, currentStep) => {
    const body = {
      status,
      data,
      currentStep,
    };
    // TODO: Remove Auhtorization header when token authentication works as expected.

    try {
      await put(`/cases/${currentCase.id}`, JSON.stringify(body), {
        Authorization: parseInt(user.personalNumber),
      }).then(res => {
        const { caseId: id, ...other } = res.data.data;
        const updatedCase = { id, ...other, updatedAt: Date.now(), ...currentCase };
        setCurrentCase(updatedCase);

        const newCases = JSON.parse(JSON.stringify(cases));
        newCases[cases.findIndex(c => c.id === currentCase.id)] = updatedCase;
        setCases(newCases);
      });
    } catch (error) {
      console.log(`Update current case error: ${error}`);
    }
  };

  return (
    <CaseContext.Provider
      value={{
        cases,
        currentCase,
        getCase,
        setCurrentCase,
        createCase,
        updateCurrentCase,
        fetchCases,
        fetching,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
}

export default CaseContext;
