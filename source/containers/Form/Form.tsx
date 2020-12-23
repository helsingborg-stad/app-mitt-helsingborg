import React, { Ref, useEffect, useState } from 'react';
import { InteractionManager } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Step from '../../components/organisms/Step/Step';
import { ScreenWrapper } from '../../components/molecules';
import { Step as StepType, StepperActions } from '../../types/FormTypes';
import { CaseStatus } from '../../types/CaseType';
import { User } from '../../types/UserTypes';
import useForm, { FormReducerState, FormPosition } from './hooks/useForm';
import Modal from '../../components/molecules/Modal';
import { ScrollView } from 'react-native-gesture-handler';

const FormScreenWrapper = styled(ScreenWrapper)`
  padding: 0;
  flex: 1;
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
    ({ id, banner, theme, title, group, description, questions, actions, colorSchema }) => (
      <Step
        key={`${id}`}
        banner={{
          ...banner,
        }}
        colorSchema={colorSchema}
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

  const mainStep = formState.currentPosition.currentMainStepIndex;
  const [scrollViewRef, setRef] = useState<ScrollView>(null);
  useEffect(() => {
    if (scrollViewRef && scrollViewRef?.scrollTo) {
      InteractionManager.runAfterInteractions(() => {
        scrollViewRef.scrollTo({ x: 0, y: 0, animated: false });
      });
    }
  }, [mainStep, scrollViewRef]);

  return (
    <FormScreenWrapper
      innerRef={(ref) => {
        setRef((ref as unknown) as ScrollView);
      }}
    >
      {stepComponents[formState.currentPosition.currentMainStepIndex]}
      <Modal visible={formState.currentPosition.level > 0}>
        {stepComponents[formState.currentPosition.index]}
      </Modal>
    </FormScreenWrapper>
  );
};

export default Form;
