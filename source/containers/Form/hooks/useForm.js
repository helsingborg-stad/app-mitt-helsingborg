import { useReducer } from 'react-native';
import formReducer from './formReducer';

function useForm(initialState) {
  const [formState, dispatch] = useReducer(formReducer, initialState);

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
