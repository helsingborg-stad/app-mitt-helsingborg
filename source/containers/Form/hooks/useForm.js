import { useReducer, useEffect } from 'react';
import formReducer from './formReducer';
import { actions } from './formActions';

/**
 * A custom hook to handle state actions and logical behavior for a form.
 * @param { object } initialState The intital state of the hook.
 */
function useForm(initialState) {
  const [formState, dispatch] = useReducer(formReducer, initialState);

  useEffect(() => {
    dispatch({ type: actions.replaceFirstNameMarkdownInAllStepTitles });
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
