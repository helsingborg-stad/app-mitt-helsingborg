import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Step from '../../components/organisms/Step/Step';
import { Step as StepType } from '../../types/FormTypes';
import { CaseStatus } from '../../types/CaseType';
import { User } from '../../types/UserTypes';
import Stepper from '../../components/atoms/Stepper/Stepper';
import useForm from './hooks/useForm';

const FormContainer = styled.View`
  flex: 1;
  height: auto;
`;

interface Props {
  startAt: number;
  steps: StepType[];
  user: User;
  initialAnswers: Record<string, any>;
  status?: CaseStatus;
  onClose: () => void;
  onSubmit: () => void;
  onStart: () => any;
  updateCaseInContext: (data: Record<string, any>, status: CaseStatus, currentStep: number) => void;
}

/**
 * The Container Component Form allows you to create, process and reuse forms. The Form component
 * is a tool to help you solve the problem of allowing end-users to interact with the
 * data and modify the data in your application.
 */
const Form: React.FC<Props> = ({
  startAt,
  steps,
  user,
  onClose,
  onStart,
  onSubmit,
  initialAnswers,
  status,
  updateCaseInContext,
}) => {
  const initialState = {
    submitted: false,
    counter: startAt,
    steps,
    user,
    formAnswers: initialAnswers,
  };

  const {
    formState,
    goToNextStep,
    goToPreviousStep,
    closeForm,
    startForm,
    handleInputChange,
    handleSubmit,
  } = useForm(initialState);
  return (
    <FormContainer>
      <Stepper active={formState.counter}>
        {formState.steps.map(
          ({ id, banner, theme, title, group, description, questions, actions }) => (
            <Step
              key={`${id}`}
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
              status={status}
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
              totalStepNumber={formState.steps.length}
              isBackBtnVisible={formState.counter > 2}
            />
          )
        )}
      </Stepper>
    </FormContainer>
  );
};

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
   * The user info.
   */
  user: PropTypes.object,
  /**
   * Initial answer for each question.
   */
  initialAnswers: PropTypes.object,
  /**
   * Status, either ongoing or submitted (or others, possibly?)
   */
  status: PropTypes.string,
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
