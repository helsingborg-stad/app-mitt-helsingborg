import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Step from '../../components/organisms/Step/Step';
import { Step as StepType, StepperActions } from '../../types/FormTypes';
import { CaseStatus } from '../../types/CaseType';
import { User } from '../../types/UserTypes';
import useForm, { FormReducerState, FormPosition } from './hooks/useForm';
import Modal from '../../components/molecules/Modal';

const FormContainer = styled.View`
  flex: 1;
  height: auto;
`;

interface Props {
  initialPosition?: FormPosition;
  steps: StepType[];
  connectivityMatrix: StepperActions[][];
  user: User;
  initialAnswers: Record<string, any>;
  status?: CaseStatus;
  onClose: () => void;
  onSubmit: () => void;
  onStart: () => any;
  updateCaseInContext: (
    data: Record<string, any>,
    status: CaseStatus,
    currentPosition: FormPosition
  ) => void;
}

/**
 * The Container Component Form allows you to create, process and reuse forms. The Form component
 * is a tool to help you solve the problem of allowing end-users to interact with the
 * data and modify the data in your application.
 */
const Form: React.FC<Props> = ({
  initialPosition,
  steps,
  connectivityMatrix,
  user,
  onClose,
  onStart,
  onSubmit,
  initialAnswers,
  status,
  updateCaseInContext,
}) => {
  const defaultInitialPosition: FormPosition = {
    index: 0,
    level: 0,
    currentMainStep: 1,
    currentMainStepIndex: 0,
  };
  const initialState: FormReducerState = {
    submitted: false,
    currentPosition: initialPosition || defaultInitialPosition,
    steps,
    user,
    formAnswers: initialAnswers,
    validations: {},
    dirtyFields: {},
    connectivityMatrix,
    allQuestions: [],
  };

  const {
    formState,
    formNavigation,
    handleInputChange,
    handleSubmit,
    handleBlur,
    validateStepAnswers,
  } = useForm(initialState);

  formNavigation.close = () => {
    onClose();
  };

  const stepComponents = formState.steps.map(
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
        validation={formState.validations}
        validateStepAnswers={validateStepAnswers}
        status={status}
        questions={questions}
        actions={actions}
        formNavigation={formNavigation}
        onSubmit={() => handleSubmit(onSubmit)}
        onFieldChange={handleInputChange}
        onFieldBlur={handleBlur}
        updateCaseInContext={updateCaseInContext}
        currentPosition={formState.currentPosition}
        totalStepNumber={formState.numberOfMainSteps}
        isBackBtnVisible={
          formState.currentPosition.currentMainStep > 1 &&
          formState.currentPosition.currentMainStep < formState.numberOfMainSteps
        }
      />
    )
  );
  return (
    <>
      <FormContainer>
        {stepComponents[formState.currentPosition.currentMainStepIndex]}
      </FormContainer>
      <Modal visible={formState.currentPosition.level > 0}>
        {stepComponents[formState.currentPosition.index]}
      </Modal>
    </>
  );
};

Form.propTypes = {
  /**
   * FormPosition object that determines where to start the form.
   */
  initialPosition: PropTypes.shape({
    index: PropTypes.number,
    level: PropTypes.number,
    currentMainStep: PropTypes.number,
    currentMainStepIndex: PropTypes.number,
  }),
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
  connectivityMatrix: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.any)),
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
  status: PropTypes.oneOf(['ongoing', 'submitted']),
  /**
   * function for updating case in caseContext
   */
  updateCaseInContext: PropTypes.func,
};

Form.defaultProps = {
  initialAnswers: {},
};

export default Form;
