import React, { useReducer, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import StorageService, { COMPLETED_FORMS_KEY } from 'app/services/StorageService';

export const State = React.createContext();
export const Dispatch = React.createContext();

export const reducer = (state, { type, number }) => {
  switch (type) {
    case 'set':
      return {
        ...state,
        number,
      };
    case 'increment':
      return {
        ...state,
        number: state.number + 1,
      };
    case 'clear':
      return {
        ...state,
        number: 0,
      };
    default:
      return state;
  }
};

export const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { number: 0 });

  useEffect(function getInitialCount() {
    StorageService.getData(COMPLETED_FORMS_KEY).then(forms => {
      if (forms !== null && forms.length >= 0) {
        dispatch({ type: 'set', number: forms.length });
      }
    });
  }, []);

  return (
    <State.Provider value={state}>
      <Dispatch.Provider value={dispatch}>{children}</Dispatch.Provider>
    </State.Provider>
  );
};

Provider.propTypes = {
  children: PropTypes.any,
};
