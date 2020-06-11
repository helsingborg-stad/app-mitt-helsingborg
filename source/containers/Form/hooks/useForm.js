import { useReducer, useEffect } from 'react';
import formReducer from './formReducer';
import { actions } from './formActions';

function useForm(initialState, onAbort) {
  const [formState, dispatch] = useReducer(formReducer, initialState);

  useEffect(() => {
    dispatch({ type: actions.replaceFirstNameMarkdownInAllStepTitles });
  }, []);

  /**
   * Function for increasing the form counter
   */
  const goToNextStep = () => {
    dispatch({ type: actions.increaseCounter });
  };

  /**
   * Function for decreasing the form counter
   */
  const goToPreviousStep = () => {
    dispatch({ type: actions.decreaseCounter });
  };

  const isLastStep = () => formState.steps.length === formState.counter;

  const handleSkip = () =>
    /** TO BE IMPLEMENTED */
    null;

  /**
   * Function for passing state and step values to the callback function that is passed down
   * to handle a form close action.
   * @param {func} callback callback function to be called on when a close action is triggerd
   */
  const closeForm = callback => {
    callback({ state: formState }, isLastStep());
  };

  const handleInputChange = () =>
    /** TO BE IMPLEMENTED */
    null;

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
