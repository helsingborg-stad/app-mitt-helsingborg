import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Step } from 'app/components/organisms';
import formReducer from 'app/containers/Form/hooks/formReducer';
import { actionTypes } from 'app/containers/Form/hooks/formActions';
import Stepper from '../../components/atoms/Stepper/Stepper';

const FormStepper = styled(Stepper)``;
const FormContainer = styled.View`
  flex: 1;
  height: auto;
`;

/**
 * The Container Component Form allows you to create, process and reuse forms. The Form component
 * is a tool to help you solve the problem of allowing end-users to interact with the
 * data and modify the data in your application.
 */

function Form({
  startAt,
  steps,
  firstName,
  onClose,
  onStart,
  onSubmit,
  initialAnswers,
  updateCaseInContext,
}) {
  const initialState = {
    submitted: false,
    counter: startAt,
    steps,
    user: {
      firstName,
    },
    formAnswers: initialAnswers,
  };

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

  return (
    <FormContainer>
      <FormStepper active={formState.counter}>
        {formState.steps.map(({ banner, theme, title, group, description, questions, actions }) => (
          <Step
            banner={{
              ...banner,
            }}
            theme={theme}
            description={{
              heading: title,
              tagline: group,
              text: description,
            }}
            answers={formState.formAnswers}
            questions={questions}
            actions={actions}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
            onClose={() => closeForm(onClose)}
            onSubmit={() => handleSubmit(onSubmit)}
            onStart={() => startForm(onStart)}
            onFieldChange={handleInputChange}
            updateCaseInContext={updateCaseInContext}
            stepNumber={formState.counter}
            isBackBtnVisible={formState.counter > 2}
          />
        ))}
      </FormStepper>
    </FormContainer>
  );
}

Form.propTypes = {
  /**
   * Number that decides which step to start on in the form.
   */
  startAt: PropTypes.number,
  /**
   * Function to handle a close action in the form.
   */
  onClose: PropTypes.func.isRequired,
  /**
   * Function to handle when a form should start.
   */
  onStart: PropTypes.func.isRequired,
  /**
   * Function to handle when a form is submitting.
   */
  onSubmit: PropTypes.func.isRequired,
  /**
   * Array of steps that the Form should render.
   */
  steps: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  /**
   * The firstName of the respondent.
   */
  firstName: PropTypes.string.isRequired,
  /**
   * Initial answer for each case.
   */
  initialAnswers: PropTypes.object,
  /**
   * function for updating case in caseContext
   */
  updateCaseInContext: PropTypes.func,
};

Form.defaultProps = {
  startAt: 1,
  initialAnswers: {},
};

export default Form;
