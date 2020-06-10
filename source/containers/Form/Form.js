import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Step } from 'app/components/organisms';
import Stepper from '../../components/atoms/Stepper/Stepper';
import useForm from './hooks/useForm';

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
function Form({ startAt, steps, firstName, onClose }) {
  const initialState = {
    counter: startAt,
    steps,
    user: {
      firstName,
    },
  };

  const { formState, goToNextStep, goToPreviousStep, closeForm } = useForm(initialState);
  return (
    <FormContainer>
      <FormStepper active={formState.counter}>
        {formState.steps.map(step => (
          <Step
            theme={step.theme}
            description={{
              heading: step.title,
              tagline: step.group,
              text: step.description,
            }}
            onBack={goToPreviousStep}
            onClose={() => closeForm(onClose)}
            isBackBtnVisible={formState.counter !== 1}
            footer={{
              buttons: [{ label: 'Nästa', onClick: goToNextStep }],
            }}
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
   * Array of steps that the Form should render.
   */
  steps: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  /**
   * The firstName of the respondent.
   */
  firstName: PropTypes.string.isRequired,
};

Form.defaultProps = {
  startAt: 1,
};

export default Form;
