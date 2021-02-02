import React, { useEffect, useState } from 'react';
import { InteractionManager } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Step from '../../components/organisms/Step/Step';
import { ScreenWrapper } from '../../components/molecules';
import { Step as StepType, StepperActions } from '../../types/FormTypes';
import { CaseStatus } from '../../types/CaseType';
import { User } from '../../types/UserTypes';
import useForm, { FormReducerState, FormPosition, FormNavigation } from './hooks/useForm';
import { Modal, useModal } from '../../components/molecules/Modal';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '../../styles/theme';
import { evaluateConditionalExpression } from '../../helpers/conditionParser';
import FormValueContext, {FormValueProvider} from './FormValueContext';

const FormScreenWrapper = styled(ScreenWrapper)`
  padding: 0;
  flex: 1;
`;

export const defaultInitialPosition: FormPosition = {
  index: 0,
  level: 0,
  currentMainStep: 1,
  currentMainStepIndex: 0,
};

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
  onSubmit,
  initialAnswers,
  status,
  updateCaseInContext,
}) => {
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
    ({ id, banner, title, group, description, questions, actions, colorSchema }) => {
      const questionsToShow = questions ? questions.filter(question => {
        const condition = question.conditionalOn;
        if (!condition || condition.trim() === '') return true;
        return evaluateConditionalExpression(condition, formState.formAnswers, formState.allQuestions);
      }): [];

      return (
        <Step
          key={`${id}`}
          banner={{
            ...banner,
          }}
          colorSchema={colorSchema}
          description={{
            heading: title,
            tagline: group,
            text: description,
          }}
          answers={formState.formAnswers}
          validation={formState.validations}
          validateStepAnswers={validateStepAnswers}
          status={status}
          questions={questionsToShow}
          allQuestions={formState.allQuestions}
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
        />);
      });
        
  const mainStep = formState.currentPosition.currentMainStepIndex;
  const [visible, toggleModal] = useModal();
  const [scrollViewRef, setRef] = useState<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef && scrollViewRef?.scrollTo) {
      InteractionManager.runAfterInteractions(() => {
        scrollViewRef.scrollTo({ x: 0, y: 0, animated: false });
      });
    }
  }, [mainStep, scrollViewRef]);

  const colorSchema = formState?.steps[formState.currentPosition.currentMainStepIndex]?.colorSchema || 'blue';

  return (
    <FormValueProvider formState={formState} formNavigation={formNavigation}>
      <FormScreenWrapper
        innerRef={(ref) => {
          setRef((ref as unknown) as ScrollView);
        }}
      >
        <SafeAreaView
          style={{ backgroundColor: theme.colors.complementary[colorSchema || 'blue'][0] }}
          edges={['top', 'right', 'left']}
        />
        {stepComponents[formState.currentPosition.currentMainStepIndex]}
        <Modal visible={formState.currentPosition.level > 0} hide={toggleModal}>
          {stepComponents[formState.currentPosition.index]}
        </Modal>
      </FormScreenWrapper>
    </FormValueProvider>
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
  user: PropTypes.object.isRequired,
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
