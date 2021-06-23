import PropTypes from 'prop-types';
import React, { useEffect, useState, useContext } from 'react';
import { InteractionManager, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Modal, useModal } from '../../components/molecules/Modal';
import ScreenWrapper from '../../components/molecules/ScreenWrapper';
import Step from '../../components/organisms/Step/Step';
import { evaluateConditionalExpression } from '../../helpers/conditionParser';
import { CaseStatus } from '../../types/CaseType';
import { Step as StepType, StepperActions } from '../../types/FormTypes';
import { User } from '../../types/UserTypes';
import useForm, { FormPosition, FormReducerState } from './hooks/useForm';
import AuthContext from '../../store/AuthContext';
import { useNotification } from '../../store/NotificationContext';
import FormUploader from '../../containers/Form/FormUploader';
import { AuthLoading } from '../../components/molecules';
import { Image } from '../../components/molecules/ImageDisplay/ImageDisplay';

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
    signature: { success: boolean },
    currentPosition: FormPosition
  ) => void;
}

export const defaultInitialPosition: FormPosition = {
  index: 0,
  level: 0,
  currentMainStep: 1,
  currentMainStepIndex: 0,
};

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
    formAnswerSnapshot: {},
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

  const {
    status: authStatus,
    isLoading,
    isResolved,
    isRejected,
    error,
    handleCancelOrder,
    isBankidInstalled,
    handleSetStatus,
    handleSetError,
  } = useContext(AuthContext);

  const answers: Record<string, Image | any> = formState.formAnswers;

  const attachments: Image[] = Object.values(answers)
    .filter((item) => Array.isArray(item) && item.length > 0 && item[0]?.path)
    .map((attachmentsArr) =>
      attachmentsArr.map((attachmentAnswer, index) => ({ ...attachmentAnswer, index }))
    )
    .flat();

  const [hasSigned, setHasSigned] = useState(status.type.includes('signed'));

  const [hasUploaded, setHasUploaded] = useState(attachments?.length && attachments.filter(({ uploadedFileName }) => uploadedFileName).length == attachments.length);

  const showNotification = useNotification();

  const signCase = () => {
    const signature = { success: true };
    formNavigation.next();
    updateCaseInContext(answers, signature, formState.currentPosition);
  }

  /**
   * Effect for signing a case.
   * If the case has attachments, signing is handled after they are uploaded.
   */
  useEffect(() => {
    if (authStatus === 'signResolved') {
      if (attachments.length === 0) {
        signCase();
      }

      handleSetStatus('idle');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus]);

  /**
   * Set auth context status to idle when navigating
   */
  useEffect(() => {
    if (authStatus !== 'idle') {
      handleSetStatus('idle');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.currentPosition]);

  /**
   * Effect for showing notification if an error occurs
   */
  useEffect(() => {
    if (isRejected && error?.message) {
      showNotification(error.message, '', 'neutral');
      handleSetError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    if (!hasSigned && authStatus === 'signResolved') {
      setHasSigned(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus]);

  formNavigation.close = () => {
    onClose();
  };

  const stepComponents = formState.steps.map(
    ({ id, banner, title, group, description, questions, actions, colorSchema }) => {
      const questionsToShow = questions ? questions.filter(question => {
        const condition = question.conditionalOn;
        if (!condition || condition.trim() === '') return true;
        return evaluateConditionalExpression(condition, formState.formAnswers, formState.allQuestions);
      }) : [];

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
          answerSnapshot={formState.formAnswerSnapshot}
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
          totalStepNumber={formState.numberOfMainSteps || 0}
          isBackBtnVisible={
            formState.currentPosition.currentMainStep > 1 &&
            formState.currentPosition.currentMainStep < formState.numberOfMainSteps
          }
          attachments={attachments}
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

  return (
    <>
      <ScreenWrapper
        innerRef={(ref) => {
          setRef((ref as unknown) as ScrollView);
        }}
      >
        <StatusBar hidden={true} />
        {stepComponents[formState.currentPosition.currentMainStepIndex]}
      </ScreenWrapper>
      <Modal visible={formState.currentPosition.level > 0} hide={toggleModal}>
        {stepComponents[formState.currentPosition.index]}
      </Modal>

      {hasSigned && !hasUploaded && attachments.length > 0 && (
        <FormUploader
          allQuestions={formState.allQuestions}
          caseStatus={status}
          answers={formState.formAnswers}
          onChange={handleInputChange}
          onResolved={() => {
            setHasUploaded(true);
            signCase();
          }}
        />
      )}

      {(isLoading || isResolved) && (
        <AuthLoading
          colorSchema={'neutral'}
          isLoading={isLoading}
          isResolved={isResolved}
          cancelSignIn={() => handleCancelOrder()}
          isBankidInstalled={isBankidInstalled}
        />
      )}
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
  user: PropTypes.object.isRequired,
  /**
   * Initial answer for each question.
   */
  initialAnswers: PropTypes.object,
  /**
   * Status
   */
  status: PropTypes.shape({
    type: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
  }),
  /**
   * function for updating case in caseContext
   */
  updateCaseInContext: PropTypes.func,
};

Form.defaultProps = {
  initialAnswers: {},
};

export default Form;
