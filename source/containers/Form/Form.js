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
function Form({ startAt, steps, firstName, onClose, initialAnswers }) {
  const initialState = {
    counter: startAt,
    steps,
    user: {
      firstName,
    },
    formAnswer: initialAnswers,
  };
  const { formState, goToNextStep, goToPreviousStep, closeForm, handleInputChange } = useForm(
    initialState
  );

  return (
    <FormContainer>
      <FormStepper active={formState.counter}>
        {formState.steps.map(({ icon, theme, title, group, description, fields }) => (
          <Step
            banner={{ iconSrc: icon }}
            theme={theme}
            description={{
              heading: title,
              tagline: group,
              text: description,
            }}
            fields={fields}
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
  /**
   * Initial answer for each case.
   */
  initialAnswers: PropTypes.object,
};

Form.defaultProps = {
  startAt: 1,
  initialAnswers: {},
};

export default Form;
