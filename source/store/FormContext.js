import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'app/helpers/ApiRequest';

const FormContext = React.createContext();

export const FormConsumer = FormContext.Consumer;

export function FormProvider({ children }) {
  const [forms, setForms] = useState({});
  const [currentForm, setCurrentFormLocal] = useState({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getForm = async id => {
    if (forms.id) {
      return forms.id;
    }
    try {
      const response = await get(`/forms3/${id}`)
        .then(res => {
          if (res && res.data) {
            setForms({ ...forms, [res.data.data.id]: res.data.data });
            return res;
          }
          console.log(' Form data not found');
        })
        .catch(error => console.log(error.message));
      console.log('response', response.data.data);
      return response.data.data;
      // console.log('Form ', form);
    } catch (error) {
      console.error(error.message);
    }
  };

  const setCurrentForm = async id => {
    if (forms.id) {
      setCurrentFormLocal(forms.id);
    }
    try {
      const response = await get(`/forms3/${id}`)
        .then(res => {
          if (res && res.data) {
            setCurrentFormLocal(res.data.data);
            setForms({ ...forms, [res.data.data.id]: res.data.data });
          } else {
            console.log(' Form data not found');
          }
        })
        .catch(error => console.log(error.message));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <FormContext.Provider value={{ currentForm, setCurrentForm, getForm }}>
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
