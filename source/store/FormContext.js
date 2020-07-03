import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { get } from 'app/helpers/ApiRequest';
import CaseContext from 'app/store/CaseContext';
import formEkbMockData from '../assets/mock/form-case-ekb';

const FormContext = React.createContext();

export const FormConsumer = FormContext.Consumer;

export function FormProvider({ children }) {
  // Todo: Get the latest case from the case context
  // so that the form can be fetched for that case
  const { cases } = useContext(CaseContext);
  const [form, setForm] = useState({});

  // TODO: set formID from case

  // Using a form id for now
  const id = '4bc10130-af17-11ea-b35b-c9388ccd1548';

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getForm = async id => {
    try {
      const response = await get(`/forms/${id}`);
      console.log('response', response);
      // TODO : set response to setForm
      setForm(formEkbMockData);
      console.log('FORM', form);
      /*  if (response && response.length) {
        setForm(response);
      } else {
        console.log('Error form not found');
      } */
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getForm(id);
    setTimeout(() => {
      setForm(formEkbMockData);
    }, 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return <FormContext.Provider value={{ form, getForm }}>{children}</FormContext.Provider>;
}

FormProvider.propTypes = {
  /**
   * Child nodes/elements.
   */
  children: PropTypes.node,
};

export default FormContext;
