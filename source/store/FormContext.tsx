import React, { ReactNode, useState } from "react";
import PropTypes from "prop-types";
import { Form } from "../types/FormTypes";
import { get } from "../helpers/ApiRequest";
import FormTypes from "../assets/formTypes";

interface FindFormError {
  error: boolean;
  message: string;
  status: number;
}

interface FormContextValue {
  getFormIdsByFormTypes?: (formTypes: string[]) => Promise<string[]>;
  findFormsByType?: (formType: string) => Promise<Form[] | FindFormError>;
  getForm?: (id: string) => Promise<Form | null>;
  getFormSummaries?: () => Promise<Form[]>;
}

interface FormProviderProps {
  children?: ReactNode | ReactNode[];
}

interface FormMap {
  [id: string]: Form;
}

const FormContext = React.createContext<FormContextValue>({});

export const FormConsumer = FormContext.Consumer;

export function FormProvider({ children }: FormProviderProps): JSX.Element {
  const [forms, setForms] = useState<FormMap>({});
  const [formSummaries, setFormSummaries] = useState([]);

  const getFormSummaries = async (): Promise<Form[]> => {
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
  };

  const getForm = async (id: string): Promise<Form | null> => {
    if (Object.keys(forms).includes(id)) {
      return forms[id];
    }

    try {
      const res = await get(`/forms/${id}`);
      if (res && res.data) {
        const newForm = res.data.data;
        setForms((oldForms) => ({ ...oldForms, [newForm.id]: newForm }));
        return newForm;
      }
      console.log("Form data not found");
    } catch (error) {
      console.error(error);
    }

    return null;
  };

  const findFormsByType = async (
    formType: string
  ): Promise<Form[] | FindFormError> => {
    const summaries = await getFormSummaries();
    if (!FormTypes.includes(formType)) {
      return {
        error: true,
        message: `This form type is not currently supported. We support the following form types: ${FormTypes}.`,
        status: 404,
      } as FindFormError;
    }
    summaries.sort((f1, f2) => f2.updatedAt - f1.updatedAt);
    const formsWithSameType = summaries.filter(
      (f) => !f.subform && f.formType === formType
    );

    return formsWithSameType;
  };

  const getFormIdsByFormTypes = async (
    formTypes: string[]
  ): Promise<string[]> => {
    const promises = formTypes.map(async (type) => {
      const formSummary = await findFormsByType(type);

      const asError = formSummary as FindFormError;

      if (asError.error) {
        console.error(asError.message);
      } else {
        const foundForms = formSummary as Form[];
        const formIds = foundForms.map(({ id }) => id);
        return formIds;
      }

      return [];
    });

    const ids = (await Promise.all(promises)).flat();

    return ids;
  };

  return (
    <FormContext.Provider
      value={{
        getFormIdsByFormTypes,
        findFormsByType,
        getForm,
        getFormSummaries,
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
