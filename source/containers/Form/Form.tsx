import React, { useEffect, useState, useContext } from "react";
import type { ScrollView } from "react-native";
import { InteractionManager, StatusBar } from "react-native";
import { Modal, useModal } from "../../components/molecules/Modal";
import ScreenWrapper from "../../components/molecules/ScreenWrapper";
import Step from "../../components/organisms/Step/Step";
import { evaluateConditionalExpression } from "../../helpers/conditionParser";
import type { Status, Person, VIVACaseDetails } from "../../types/Case";
import type { Action, Answer } from "../../types/CaseContext";
import { ActionTypes } from "../../types/CaseContext";
import type {
  Step as StepType,
  StepperActions,
  Question,
} from "../../types/FormTypes";
import type { User } from "../../types/UserTypes";
import { ApplicationStatusType } from "../../types/Case";
import type {
  FormPeriod,
  FormPosition,
  FormReducerState,
} from "./hooks/useForm";
import useForm from "./hooks/useForm";
import AuthContext from "../../store/AuthContext";
import { useNotification } from "../../store/NotificationContext";
import FormUploader from "./FormUploader";
import { AuthLoading } from "../../components/molecules";
import type { Image } from "../../components/molecules/ImageItem/ImageItem.types";
import CloseDialog from "../../components/molecules/CloseDialog";
import type { PrimaryColor } from "../../theme/themeHelpers";

import type { DialogText } from "./types";
import { UPDATE_CASE_STATE } from "./types";
import type { File } from "../../components/molecules/FilePicker/FilePicker.types";

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

interface Props {
  initialPosition?: FormPosition;
  steps: StepType[];
  connectivityMatrix: StepperActions[][];
  user: User;
  initialAnswers: Record<string, unknown>;
  status: Status;
  onClose: () => void;
  onSubmit: () => void;
  onUpdateCase: (
    data: Record<string, Answer>,
    signature: { success: boolean } | undefined,
    currentPosition: FormPosition
  ) => Promise<Action | void>;
  period?: FormPeriod;
  editable: boolean;
  details: VIVACaseDetails;
  persons: Person[];
  encryptionPin: string;
  completionsClarificationMessage: string;
}

export const defaultInitialPosition: FormPosition = {
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

  const answers: Record<string, Image | any> = formState.formAnswers;

  function answerIsAttachment(answer: unknown): answer is File {
    return (answer as File)?.mime?.length > 0;
  }
  const attachments = Object.values(answers)
    .filter(Array.isArray)
    .flat()
    .filter(answerIsAttachment);

  const [hasSigned, setHasSigned] = useState(status.type.includes(SIGNED));

  const [hasUploaded, setHasUploaded] = useState(
    attachments?.length &&
      attachments.filter(({ uploadedFileName }) => uploadedFileName).length ===
        attachments.length
  );

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
  const [, toggleModal] = useModal();
  const [scrollViewRef, setRef] = useState<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef && scrollViewRef?.scrollTo) {
      void InteractionManager.runAfterInteractions(() => {
        scrollViewRef.scrollTo({ x: 0, y: 0, animated: false });
      });
    }
  }, [mainStep, scrollViewRef]);

  const handleCloseForm = async () => {
    setUpdateCaseState(UPDATE_CASE_STATE.UPDATING);

    const isLastMainStep =
      formState.currentPosition.level === 0 &&
      formState.currentPosition.currentMainStep === formState.totalStepNumber;

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
          onFieldChange={handleInputChange}
          onFieldBlur={handleBlur}
          onAddAnswer={handleAddAnswer}
          onFieldMount={handleInputChange}
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
