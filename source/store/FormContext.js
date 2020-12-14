import React, {useState} from 'react';
import env from 'react-native-config';
import PropTypes from 'prop-types';
import {get} from '../helpers/ApiRequest';
import FormTypes from '../assets/formTypes';

const FormContext = React.createContext();

export const FormConsumer = FormContext.Consumer;

export function FormProvider({children}) {
  const [forms, setForms] = useState({});
  const [formSummaries, setFormSummaries] = useState([]);

  const getFormSummaries = async () => {
    if (formSummaries.length > 0) {
      return formSummaries;
    }
    try {
      const response = await get('/forms', {
        'x-api-key': env.MITTHELSINGBORG_IO_APIKEY,
      });
      if (response.data.data.forms) {
        setFormSummaries(response.data.data.forms);
        return response.data.data.forms;
      }
    } catch (error) {
      console.log(error.message);
    }
    return [];
  };

  const getForm = async (id) => {
    if (Object.keys(forms).includes(id)) {
      return forms[id];
    }
    try {
      const response = await get(`/forms/${id}`, {
        'x-api-key': env.MITTHELSINGBORG_IO_APIKEY,
      })
        .then((res) => {
          if (res && res.data) {
            setForms({...forms, [res.data.data.id]: res.data.data});
            return res;
          }
          console.log('Form data not found');
        })
        .catch((error) => console.log(error.message));
      return response.data.data;
    } catch (error) {
      console.error(error.message);
    }
  };

  const findFormByType = async (formType) => {
    const summaries = await getFormSummaries();
    if (!FormTypes.includes(formType)) {
      return {
        error: true,
        message: `This form type is not currently supported. We support the following form types: ${FormTypes}.`,
        status: 404,
      };
    }
    summaries.sort((f1, f2) => f2.updatedAt - f1.updatedAt);
    const form = summaries.find((f) => !f.subform && f.formType === formType);
    return form;
  };

  const getFormIdsByFormTypes = async (formTypes) => {
    const promises = formTypes.map(async (type) => {
      const formSummary = await findFormByType(type);
      return formSummary?.id;
    });

    const ids = await Promise.all(promises);
    const idList = ids.filter((id) => id);
    return idList;
  };

  return (
    <FormContext.Provider
      value={{
        getFormIdsByFormTypes,
        findFormByType,
        getForm,
        getFormSummaries,
      }}>
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
