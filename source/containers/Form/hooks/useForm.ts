import { useReducer, useEffect } from 'react';
import formReducer from './formReducer';
import { Step } from '../../../types/FormTypes';
import { User } from '../../../types/UserTypes';

export interface FormReducerState {
  submitted: boolean;
  counter: number;
  steps: Step[];
  user: User;
  formAnswers: Record<string, any>;
}

function useForm(initialState: FormReducerState) {
  const [formState, dispatch] = useReducer(formReducer, initialState);

  useEffect(() => {
    dispatch({
      type: 'REPLACE_MARKDOWN_TEXT',
    });
  }, []);

  /**
   * Function for increasing the form counter
   */
  const goToNextStep = () =>
    dispatch({
      type: 'INCREASE_COUNTER',
    });

  /**
   * Function for decreasing the form counter
   */
  const goToPreviousStep = () =>
    dispatch({
      type: 'DECREASE_COUNTER',
    });

  const isLastStep = () => formState.steps.length === formState.counter;

  /**
   * Function for passing state and step values to the callback function that is passed down
   * to handle a form start action.
   * @param {func} callback callback function to be called on when a start action is triggerd
   */
  const startForm = (callback: () => void) => {
    dispatch({
      type: 'START_FORM',
      payload: { callback },
    });
  };

  /**
   * Function for handling a on submit action in the form.
   * @param {func} callback callback function to be called on form submit.
   */
  const handleSubmit = (callback: (formAnswers: Record<string, any>) => void) => {
    dispatch({
      type: 'SUBMIT_FORM',
      payload: { callback },
    });
  };

  const handleSkip = () =>
    /** TO BE IMPLEMENTED */
    null;

  /**
   * Function for passing state and step values to the callback function that is passed down
   * to handle a form close action.
   * @param {func} callback callback function to be called on when a close action is triggerd
   */
  const closeForm = (callback: (s: { state: FormReducerState }, isLastStep: boolean) => any) =>
    callback({ state: formState }, isLastStep());

  /**
   * Function for updating answer.
   */
  const handleInputChange = (answer: Record<string, any>) => {
    // console.log(answer);
    dispatch({ type: 'UPDATE_ANSWER', payload: answer });
  };

  return {
    formState,
    goToNextStep,
    goToPreviousStep,
    handleInputChange,
    handleSkip,
    closeForm,
    startForm,
    handleSubmit,
    isLastStep,
  };
}

export default useForm;
