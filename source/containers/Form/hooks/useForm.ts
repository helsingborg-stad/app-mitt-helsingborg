import { useReducer, useEffect } from "react";
import formReducer from "./formReducer";
import type { Question, Step, StepperActions } from "../../../types/FormTypes";
import type { User } from "../../../types/UserTypes";
import type { Answer, Person } from "../../../types/Case";

export interface FormPosition {
  index: number;
  level: number;
  currentMainStep: number;
  currentMainStepIndex: number;
  numberOfMainSteps: number;
}

export interface FormPeriod {
  startDate: number;
  endDate: number;
}

export interface FormReducerState {
  submitted: boolean;
  currentPosition: FormPosition;
  steps: Step[];
  allQuestions: Question[];
  user: User;
  connectivityMatrix: StepperActions[][];
  formAnswers: Record<string, Answer>;
  formAnswerSnapshot: Record<string, unknown>;
  validations: Record<string, unknown>;
  dirtyFields: Record<string, unknown>;
  numberOfMainSteps?: number | undefined;
  period?: FormPeriod | undefined;
  editable?: boolean | undefined;
  persons: Person[];
  encryptionPin: string;
  completionsClarificationMessage: string;
}

interface FormHook {
  formState: FormReducerState;
  formNavigation: {
    next: () => void;
    back: () => void;
    up: (targetStep: number | string) => void;
    down: (targetStep: number | string) => void;
    start: (callback: () => void) => void;
    goToMainForm: () => void;
    goToMainFormAndNext: () => void;
    createSnapshot: () => void;
    deleteSnapshot: () => void;
    restoreSnapshot: () => void;
    close: () => void;
    isLastStep: () => boolean;
  };
  handleInputChange: (
    answer: Record<string, Answer>,
    questionId: string
  ) => void;
  handleBlur: (answer: Record<string, unknown>, questionId: string) => void;
  handleSubmit: (
    callback: (formAnswers: Record<string, unknown>) => void
  ) => void;
  handleAddAnswer: (
    answer: Record<string, unknown>,
    questionId: string
  ) => void;
  validateStepAnswers: (
    onErrorCallback: () => void,
    onValidCallback: () => void
  ) => void;
}

function useForm(initialState: FormReducerState): FormHook {
  const [formState, dispatch] = useReducer(formReducer, initialState);

  useEffect(() => {
    dispatch({ type: "REPLACE_MARKDOWN_TEXT" });
  }, []);

  useEffect(() => {
    dispatch({ type: "GET_ALL_QUESTIONS" });
  }, [formState.steps]);

  const validateStepAnswers = (
    onErrorCallback: () => void,
    onValidCallback: () => void
  ) => {
    dispatch({
      type: "VALIDATE_ALL_STEP_ANSWERS",
      payload: {
        onErrorCallback,
        onValidCallback,
      },
    });
  };

  const handleSubmit = (
    callback: (formAnswers: Record<string, unknown>) => void
  ) => {
    dispatch({
      type: "SUBMIT_FORM",
      payload: { callback },
    });
  };

  const handleBlur = (answer: Record<string, unknown>, questionId: string) => {
    dispatch({ type: "DIRTY_FIELD", payload: { answer, id: questionId } });
    dispatch({
      type: "VALIDATE_ANSWER",
      payload: { answer, id: questionId, checkIfDirty: true },
    });
  };

  const handleInputChange = (
    answer: Record<string, unknown>,
    questionId: string
  ) => {
    dispatch({ type: "UPDATE_ANSWER", payload: answer });
    dispatch({
      type: "VALIDATE_ANSWER",
      payload: { answer, id: questionId, checkIfDirty: true },
    });
  };

  const handleAddAnswer = (
    answer: Record<string, unknown>,
    questionId: string
  ) => {
    dispatch({
      type: "VALIDATE_ANSWER",
      payload: { answer, id: questionId, checkIfDirty: true },
    });
  };

  const formNavigation = {
    next: () => dispatch({ type: "GO_NEXT" }),
    back: () => dispatch({ type: "GO_BACK" }),

    up: (targetStep: number | string) =>
      dispatch({ type: "GO_UP", payload: { targetStep } }),

    down: (targetStep: number | string) =>
      dispatch({ type: "GO_DOWN", payload: { targetStep } }),

    start: (callback: () => void) =>
      dispatch({ type: "START_FORM", payload: { callback } }),

    goToMainForm: () => dispatch({ type: "GO_TO_MAIN_FORM" }),
    goToMainFormAndNext: () => dispatch({ type: "GO_TO_MAIN_FORM_AND_NEXT" }),
    createSnapshot: () => dispatch({ type: "CREATE_SNAPSHOT" }),
    deleteSnapshot: () => dispatch({ type: "DELETE_SNAPSHOT" }),
    restoreSnapshot: () => dispatch({ type: "RESTORE_SNAPSHOT" }),

    close: () => undefined,
    isLastStep: () => false,
  };

  return {
    formState,
    formNavigation,
    handleInputChange,
    handleBlur,
    handleSubmit,
    handleAddAnswer,
    validateStepAnswers,
  };
}

export default useForm;
