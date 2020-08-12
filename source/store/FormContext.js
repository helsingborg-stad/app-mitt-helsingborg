import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'app/helpers/ApiRequest';

const FormContext = React.createContext();

export const FormConsumer = FormContext.Consumer;

export function FormProvider({ children }) {
  const [forms, setForms] = useState({});
  const [formSummaries, setFormSummaries] = useState([]);

  const [currentForm, setCurrentFormLocal] = useState({});

  const getFormSummaries = async () => {
    try {
      const response = await get('/forms3');
      if (response.data.data.forms) {
        setFormSummaries(response.data.data.forms);
        return response.data.data.forms;
      }
    } catch (error) {
      console.log(error.message);
    }
    return [];
  };

  const getForm = async id => {
    if (Object.keys(forms).includes(id)) {
      return forms[id];
    }
    try {
      const response = await get(`/forms3/${id}`)
        .then(res => {
          if (res && res.data) {
            setForms({ ...forms, [res.data.data.id]: res.data.data });
            return res;
          }
          console.log('Form data not found');
        })
        .catch(error => console.log(error.message));
      // console.log('Fetched form:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(error.message);
    }
  };

  const setCurrentForm = async id => {
    getForm(id).then(resp => setCurrentFormLocal(resp));
  };

  return (
    <FormContext.Provider value={{ currentForm, setCurrentForm, getForm, getFormSummaries }}>
      {children}
    </FormContext.Provider>
  );
}

FormProvider.propTypes = {
  /**
   * Child nodes/elements.
   */
  children: PropTypes.node,
};

export default FormContext;
