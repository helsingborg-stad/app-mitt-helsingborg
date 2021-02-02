import { createContext } from 'react';
import PropTypes from 'prop-types';
import { User } from '../../types/UserTypes';
import { FormNavigation, FormPosition, FormReducerState } from './hooks/useForm';

export const defaultInitialPosition: FormPosition = {
  index: 0,
  level: 0,
  currentMainStep: 1,
  currentMainStepIndex: 0,
};
interface FormValue {
  formState: FormReducerState;
  formNavigation: FormNavigation;
  handleInputChange: (answer: Record<string, any>, questionId: string) => void;
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
  handleInputChange: () => {},
  formNavigation: {
    next: () => {},
    back: () => {},
    up: () => {},
    down: () => {},
    start: () => {},
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
  handleInputChange,
  children,
}: React.PropsWithChildren<FormValue>) => {
  const value: FormValue = { formState, formNavigation, handleInputChange };
  return <FormValueContext.Provider value={value}>{children}</FormValueContext.Provider>;
};

FormValueProvider.propTypes = {
  children: PropTypes.any,
  formState: PropTypes.object,
  formNavigation: PropTypes.object,
};

export default FormValueContext;
