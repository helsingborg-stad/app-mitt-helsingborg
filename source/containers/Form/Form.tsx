import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
} from "react";
import { InteractionManager, StatusBar } from "react-native";

import type { ScrollView } from "react-native";

import {
  ScreenWrapper,
  AuthLoading,
  CloseDialog,
} from "../../components/molecules";
import Step from "../../components/organisms/Step/Step";
import { Modal, useModal } from "../../components/molecules/Modal";

import AuthContext from "../../store/AuthContext";
import { useNotification } from "../../store/NotificationContext";

import FormUploader from "./FormUploader";
import { getAttachmentAnswers } from "./Form.helpers";
import { evaluateConditionalExpression } from "../../helpers/conditionParser";

import useForm from "./hooks/useForm";
import useAppState from "../../hooks/useAppState";
import { replaceText } from "./hooks/textReplacement";

import { UPDATE_CASE_STATE } from "./Form.types";
import { ActionTypes } from "../../types/CaseContext";
import { ApplicationStatusType } from "../../types/Case";
import type { DialogText, FormProps } from "./Form.types";
import type { PrimaryColor } from "../../theme/themeHelpers";
import type { FormPosition, FormReducerState } from "./hooks/useForm";
import type { Step as StepType, Question } from "../../types/FormTypes";

const { SIGNED, NOT_STARTED } = ApplicationStatusType;

const dialogText: Record<UPDATE_CASE_STATE, DialogText> = {
  [UPDATE_CASE_STATE.UPDATING]: {
    title: "Vänligen vänta",
    body: "Uppdatering pågår ...",
  },
  [UPDATE_CASE_STATE.ERROR]: {
    title: "Ett fel har uppstått!",
    body: "Vill du försöka igen?",
  },
  [UPDATE_CASE_STATE.IDLE]: {
    title: "",
    body: "",
  },
};

const defaultInitialPosition: FormPosition = {
  index: 0,
  level: 0,
  currentMainStep: 1,
  currentMainStepIndex: 0,
  numberOfMainSteps: 0,
};

export const defaultInitialStatus = {
  type: NOT_STARTED,
  name: "Ej påbörjad",
  description: "Ansökan är ej påbörjad.",
};

const CLOSE_FORM_DELAY = 1000;

const Form: React.FC<FormProps> = ({
  initialPosition,
  steps,
  connectivityMatrix,
  user,
  period,
  onClose,
  onSubmit,
  initialAnswers = {},
  status,
  onUpdateCase,
  editable,
  details,
  persons,
  encryptionPin,
  completionsClarificationMessage,
}): JSX.Element => {
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
    period,
    editable,
    persons,
    encryptionPin,
    completionsClarificationMessage,
  };

  const {
    formState,
    formNavigation,
    handleInputChange,
    handleSubmit,
    handleBlur,
    handleAddAnswer,
    validateStepAnswers,
  } = useForm(initialState);

  const {
    status: authStatus,
    isLoading,
    isResolved,
    isRejected,
    error,
    handleCancelOrder,
    handleSetStatus,
    handleSetError,
    authenticateOnExternalDevice,
  } = useContext(AuthContext);

  const [updateCaseState, setUpdateCaseState] = useState(
    UPDATE_CASE_STATE.IDLE
  );

  const [hasSigned, setHasSigned] = useState(status.type.includes(SIGNED));
  const [hasUploaded, setHasUploaded] = useState(false);

  const answers = formState.formAnswers;
  const attachments = getAttachmentAnswers(answers);

  const showNotification = useNotification();

  const signCase = async () => {
    const signature = { success: true };
    formNavigation.next();
    await onUpdateCase(answers, signature, formState.currentPosition);
  };

  /**
   * Effect for signing a case.
   * If the case has attachments, signing is handled after they are uploaded.
   */
  useEffect(() => {
    if (authStatus === "signResolved") {
      if (attachments.length === 0) {
        void signCase();
      }

      handleSetStatus("idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus]);

  /**
   * Set auth context status to idle when navigating
   */
  useEffect(() => {
    if (authStatus !== "idle") {
      handleSetStatus("idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.currentPosition]);

  /**
   * Effect for showing notification if an error occurs
   */
  useEffect(() => {
    if (isRejected && error?.message) {
      showNotification(error.message, "", "neutral");
      handleSetError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    if (!hasSigned && authStatus === "signResolved") {
      setHasSigned(true);
    }
  }, [authStatus]);

  formNavigation.close = () => {
    onClose();
  };

  const mainStep = formState.currentPosition.currentMainStepIndex;
  const isLastMainStep =
    formState.currentPosition.level === 0 &&
    formState.currentPosition.currentMainStep ===
      formState.currentPosition.numberOfMainSteps;

  const [, toggleModal] = useModal();
  const [scrollViewRef, setRef] = useState<ScrollView | null>(null);

  const { isInForeground } = useAppState();
  const wasJustInForeground = useRef(true);

  const updateCase = useCallback(
    () => onUpdateCase(answers, undefined, formState.currentPosition),
    [answers, formState.currentPosition, onUpdateCase]
  );

  useEffect(() => {
    const didJustChangeFromForegroundToBackground =
      !isInForeground && wasJustInForeground.current;

    if (
      didJustChangeFromForegroundToBackground &&
      !isLastMainStep &&
      editable
    ) {
      void updateCase()
        .then(() => {
          console.log("updated case in background");
        })
        .catch((updateCaseError) => {
          console.error(
            "failed to update case in background:",
            updateCaseError?.message ?? updateCaseError
          );
        });
    }

    wasJustInForeground.current = isInForeground;
  }, [editable, isInForeground, isLastMainStep, updateCase]);

  useEffect(() => {
    if (scrollViewRef && scrollViewRef?.scrollTo) {
      void InteractionManager.runAfterInteractions(() => {
        scrollViewRef.scrollTo({ x: 0, y: 0, animated: false });
      });
    }
  }, [mainStep, scrollViewRef]);

  const handleCloseForm = async () => {
    setUpdateCaseState(UPDATE_CASE_STATE.UPDATING);

    if (!isLastMainStep && editable) {
      const result = await onUpdateCase(
        answers,
        undefined,
        formState.currentPosition
      );

      if (result?.type === ActionTypes.API_ERROR) {
        setUpdateCaseState(UPDATE_CASE_STATE.ERROR);
      } else {
        setTimeout(() => {
          setUpdateCaseState(UPDATE_CASE_STATE.IDLE);
          onClose();
        }, CLOSE_FORM_DELAY);
      }
    } else {
      onClose();
    }
  };

  const shouldShowBackButton =
    formState.currentPosition.currentMainStep > 1 &&
    formState.currentPosition.currentMainStep <
      formState.currentPosition.numberOfMainSteps;

  const showCloseDialog = updateCaseState !== UPDATE_CASE_STATE.IDLE;
  const closeDialogTitle = dialogText[updateCaseState].title;
  const closeDialogBody = dialogText[updateCaseState].body;
  const closeDialogButtons =
    updateCaseState === UPDATE_CASE_STATE.ERROR
      ? [
          {
            text: "Nej",
            color: "neutral" as PrimaryColor,
            clickHandler: onClose,
          },
          {
            text: "Ja",
            clickHandler: handleCloseForm,
          },
        ]
      : [];

  const processHiddenValue = useCallback(
    (value: Record<string, unknown>, id: string) => {
      const step: StepType = formState.steps[
        formState.currentPosition.index
      ] as unknown as StepType;

      const questionById: Question | undefined = (step.questions ?? []).find(
        (question) => question.id === id
      );

      const questionByInputs = (step.questions ?? [])
        .map((question) => question.inputs)
        .filter((inputs) => inputs && inputs.length > 0)
        .flat()
        .find((input) => input?.id === id);

      const isQuestionHidden = questionById?.type === "hidden";
      const isQuestionInputsHidden = questionByInputs?.type === "hidden";

      const valueKeys = Object.keys(value);
      const isHidden = isQuestionHidden || isQuestionInputsHidden;
      const newValue = isHidden
        ? {
            ...value,
            [valueKeys[0]]: replaceText(
              value[valueKeys[0]] as string,
              user,
              period
            ),
          }
        : value;

      return handleInputChange(newValue);
    },
    [
      formState.currentPosition.index,
      formState.steps,
      handleInputChange,
      period,
      user,
    ]
  );

  const stepComponents = formState.steps.map(
    ({
      id,
      banner,
      title,
      group,
      description,
      questions,
      actions,
      colorSchema,
    }: StepType) => {
      const questionsToShow: Question[] = questions
        ? questions.filter((question: Question) => {
            const condition = question.conditionalOn;
            if (!condition || condition.trim() === "") return true;
            return evaluateConditionalExpression(
              condition,
              formState.formAnswers,
              formState.allQuestions
            );
          })
        : [];

      return (
        <Step
          key={`${id}`}
          banner={banner}
          colorSchema={colorSchema}
          description={{
            heading: title,
            tagline: group,
            text: description,
          }}
          details={details}
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
          onFieldChange={processHiddenValue}
          onFieldBlur={handleBlur}
          onAddAnswer={handleAddAnswer}
          onFieldMount={processHiddenValue}
          currentPosition={formState.currentPosition}
          totalStepNumber={formState.currentPosition.numberOfMainSteps}
          isBackBtnVisible={shouldShowBackButton}
          attachments={attachments}
          isFormEditable={editable}
          onCloseForm={handleCloseForm}
        />
      );
    }
  );

  return (
    <>
      <ScreenWrapper
        innerRef={(ref) => {
          setRef(ref as unknown as ScrollView);
        }}
      >
        <StatusBar hidden />
        {stepComponents[formState.currentPosition.currentMainStepIndex]}
      </ScreenWrapper>
      <Modal visible={formState.currentPosition.level > 0} hide={toggleModal}>
        {stepComponents[formState.currentPosition.index]}
      </Modal>
      {hasSigned && !hasUploaded && attachments.length > 0 && (
        <FormUploader
          caseStatus={status}
          answers={formState.formAnswers}
          onChange={handleInputChange}
          onResolved={() => {
            setHasUploaded(true);
            void signCase();
          }}
        />
      )}
      {(isLoading || isResolved) && (
        <AuthLoading
          colorSchema="neutral"
          isLoading={isLoading}
          isResolved={isResolved}
          cancelSignIn={() => handleCancelOrder()}
          authenticateOnExternalDevice={authenticateOnExternalDevice}
        />
      )}
      <CloseDialog
        visible={showCloseDialog}
        title={closeDialogTitle}
        body={closeDialogBody}
        buttons={closeDialogButtons}
      />
    </>
  );
};

export default Form;
