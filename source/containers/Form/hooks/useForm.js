import { useReducer, useEffect } from 'react';
import formReducer from './formReducer';
import { actionTypes } from './formActions';

function useForm(initialState) {
  const [formState, dispatch] = useReducer(formReducer, initialState);

  useEffect(() => {
    dispatch({
      type: actionTypes.REPLACE_FIRSTNAME_MARKDOWN_IN_ALL_STEP_TITLES,
    });
  }, []);

  /**
   * Function for increasing the form counter
   */
  const goToNextStep = () =>
    dispatch({
      type: actionTypes.INCREASE_COUNTER,
    });

  /**
   * Function for decreasing the form counter
   */
  const goToPreviousStep = () =>
    dispatch({
      type: actionTypes.DECREASE_COUNTER,
    });

  const isLastStep = () => formState.steps.length === formState.counter;

  /**
   * Function for passing state and step values to the callback function that is passed down
   * to handle a form start action.
   * @param {func} callback callback function to be called on when a start action is triggerd
   */
  const startForm = callback => {
    dispatch({
      type: actionTypes.START_FORM,
      payload: { callback },
    });
  };

  /**
   * Function for handling a on submit action in the form.
   * @param {func} callback callback function to be called on form submit.
   */
  const handleSubmit = callback => {
    dispatch({
      type: actionTypes.SUBMIT_FORM,
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
  const closeForm = callback => callback({ state: formState }, isLastStep());

  /**
   * Function for updating answer.
   */
  const handleInputChange = answer => {
    // console.log(answer);
    dispatch({ type: actionTypes.UPDATE_ANSWER, payload: answer });
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
