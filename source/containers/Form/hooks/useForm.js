import { useReducer, useEffect } from 'react';
import formReducer, { actions } from './formReducer';

/**
 * A custom hook to handle state actions and logical behavior for a form.
 * @param {obj} initialState The intital state of the hook.
 * @param {obj} user A object containg information about the user.
 */
function useForm(initialState) {
  const [formState, dispatch] = useReducer(formReducer, initialState);

  useEffect(() => {
    dispatch({ type: actions.setFirstNameInStepTitles });
  }, []);

  const handleNext = () =>
    /** TO BE IMPLEMENTED */
    null;
  const handlePrev = () =>
    /** TO BE IMPLEMENTED */
    null;
  const handleSkip = () =>
    /** TO BE IMPLEMENTED */
    null;
  const handleInputChange = () =>
    /** TO BE IMPLEMENTED */
    null;
  return {
    formState,
    handlePrev,
    handleNext,
    handleInputChange,
    handleSkip,
  };
}

export default useForm;
