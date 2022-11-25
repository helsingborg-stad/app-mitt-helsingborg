import type { ReactNode } from "react";
import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import type { Form } from "../types/FormTypes";
import { get, isRequestError } from "../helpers/ApiRequest";

interface FormContextValue {
  forms: Record<string, Form>;
  getForm: (id: string) => Promise<Form | null>;
  getFormSummaries: () => Promise<Form[]>;
}

interface FormProviderProps {
  children?: ReactNode | ReactNode[];
}

interface FormMap {
  [id: string]: Form;
}

const FormContext = React.createContext<FormContextValue>({});

export function FormProvider({ children }: FormProviderProps): JSX.Element {
  const [forms, setForms] = useState<FormMap>({});
  const [formSummaries, setFormSummaries] = useState([]);

  const getFormSummaries = useCallback(async (): Promise<Form[]> => {
    if (formSummaries.length > 0) {
      return formSummaries;
    }
    try {
      const response = await get("/forms");
      if (response.data.data.forms) {
        setFormSummaries(response.data.data.forms);
        return response.data.data.forms;
      }
    } catch (error) {
      console.error(error);
    }
    return [];
  }, [formSummaries]);

  const getForm = useCallback(
    async (id: string): Promise<Form> => {
      if (Object.keys(forms).includes(id)) {
        return forms[id];
      }

      const res = await get<Form>(`/forms/${id}`);

      if (isRequestError(res)) {
        console.error("Could not fetch form:", res.message);
        throw new Error(res.message);
      }

      const newForm = res.data.data;
      setForms((oldForms) => ({ ...oldForms, [newForm.id]: newForm }));
      return newForm;
    },
    [forms]
  );

  return (
    <FormContext.Provider
      value={{
        getForm,
        getFormSummaries,
        forms,
      }}
    >
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
