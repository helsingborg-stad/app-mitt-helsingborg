import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { get } from 'app/helpers/ApiRequest';
import CaseContext from 'app/store/CaseContext';

const FormContext = React.createContext();

export const FormConsumer = FormContext.Consumer;

export function FormProvider({ children }) {
  // Todo: Get the latest case from the case context
  // so that the form can be fetched for that case
  const { cases } = useContext(CaseContext);
  const [form, setForm] = useState({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getForm = async id => {
    try {
      const response = await get(`/forms/${id}`)
        .then(res => {
          if (res && res.data) {
            setForm(res.data.data);
          } else {
            console.log(' Form data not found');
          }
        })
        .catch(error => console.log(error.message));

      console.log('response', response);
      console.log('Form ', form);
    } catch (error) {
      console.error(error.message);
    }
  };

  /* 
  useEffect(() => {
    getForm(id);
  }, [id]); */

  return <FormContext.Provider value={{ form, getForm }}>{children}</FormContext.Provider>;
}

FormProvider.propTypes = {
  /**
   * Child nodes/elements.
   */
  children: PropTypes.node,
};

export default FormContext;
