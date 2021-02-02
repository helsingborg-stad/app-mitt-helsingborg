import { createContext } from 'react';
import PropTypes from 'prop-types';
import { User } from '../../types/UserTypes';
import { FormNavigation, FormReducerState } from './hooks/useForm';
import { defaultInitialPosition } from './Form';

interface FormValue {
  formState: FormReducerState;
  formNavigation: FormNavigation;
}

const emptyUser: User = {
  firstName: '',
  lastName: '',
  mobilePhone: '',
  email: '',
  civilStatus: 'OG',
  address: {
    street: '',
    postalCode: '',
    city: 'Helsingborg',
  },
};

const defaultFormValue: FormValue = {
  formState: {
    submitted: false,
    currentPosition: defaultInitialPosition,
    steps: [],
    user: emptyUser,
    formAnswers: {},
    validations: {},
    dirtyFields: {},
    connectivityMatrix: [],
    allQuestions: [],
  },
  formNavigation: {
    next: () => {},
    back: () => {},
    up: (targetStep: number | string) => {},
    down: (targetStep: number | string) => {},
    start: (callback: () => void) => {},
    close: () => {},
    goToMainForm: () => {},
    goToMainFormAndNext: () => {},
    isLastStep: () => false,
  },
};

const FormValueContext = createContext(defaultFormValue);

export const FormValueProvider = ({
  formState,
  formNavigation,
  children,
}: React.PropsWithChildren<FormValue>) => {
  const value: FormValue = { formState, formNavigation };
  return <FormValueContext.Provider value={value}>{children}</FormValueContext.Provider>;
};

FormValueProvider.propTypes = {
  children: PropTypes.any,
  formState: PropTypes.object,
  formNavigation: PropTypes.object,
};

export default FormValueContext;
