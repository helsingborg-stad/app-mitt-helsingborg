import { useReducer, useEffect } from 'react';
import formReducer from './formReducer';
import { actionTypes } from './formActions';

function useForm(initialState) {
  const [formState, dispatch] = useReducer(formReducer, initialState);

  useEffect(() => {
    dispatch({ type: actionTypes.REPLACE_FIRSTNAME_MARKDOWN_IN_ALL_STEP_TITLES });
  }, []);

  /**
   * Function for increasing the form counter
   */
  const goToNextStep = () => dispatch({ type: actionTypes.INCREASE_COUNTER });

  /**
   * Function for decreasing the form counter
   */
  const goToPreviousStep = () => dispatch({ type: actionTypes.DECREASE_COUNTER });

  const isLastStep = () => formState.steps.length === formState.counter;

  const handleSkip = () =>
    /** TO BE IMPLEMENTED */
    null;

  /**
   * Function for passing state and step values to the callback function that is passed down
   * to handle a form close action.
   * @param {func} callback callback function to be called on when a close action is triggerd
   */
  const closeForm = callback => callback({ state: formState }, isLastStep());

  /**
   * Function for updating user answer
   */
  const handleInputChange = userAnswer =>
    dispatch({ type: actionTypes.UPDATE_USER_ANSWER, payload: userAnswer });

  return {
    formState,
    goToNextStep,
    goToPreviousStep,
    handleInputChange,
    handleSkip,
    closeForm,
    isLastStep,
  };
}

export default useForm;
