import { FormReducerState } from './useForm';
import {
  replaceMarkdownText,
  goNext,
  goBack,
  goDown,
  goUp,
  goBackToMainForm,
  startForm,
  submitForm,
  updateAnswer,
  computeNumberMainSteps,
  getAllQuestions,
  validateAnswer,
  validateAllStepAnswers,
  dirtyField,
} from './formActions';

type Action =
  | {
      type: 'REPLACE_MARKDOWN_TEXT';
    }
  | {
      type: 'COUNT_MAIN_STEPS';
    }
  | {
      type: 'GET_ALL_QUESTIONS';
    }
  | {
      type: 'GO_NEXT';
    }
  | {
      type: 'GO_BACK';
    }
  | {
      type: 'GO_UP';
      payload: { targetStep: number | string };
    }
  | {
      type: 'GO_DOWN';
      payload: { targetStep: number | string };
    }
  | {
      type: 'GO_TO_MAIN_FORM';
    }
  | {
      type: 'START_FORM';
      payload: { callback: () => void };
    }
  | {
      type: 'UPDATE_ANSWER';
      payload: Record<string, any>;
    }
  | {
      type: 'VALIDATE_ANSWER';
      payload: { answer: Record<string, any>; id: string; checkIfDirty?: boolean };
    }
  | {
      type: 'VALIDATE_ALL_STEP_ANSWERS';
      payload: { onErrorCallback: () => void; onValidCallback: () => void };
    }
  | {
      type: 'DIRTY_FIELD';
      payload: { answer: Record<string, any>; id: string };
    }
  | {
      type: 'SUBMIT_FORM';
      payload: { callback: (formAnswers: Record<string, any>) => void };
    };

/**
 * The formReducer is a pure function that takes the previous state and an action, and returns the
 * next state. (previousState, action) => nextState. It's called a reducer because it's the type
 * of function you would pass to Array.
 * @param {FormReducerState} state
 * @param {object} action
 */
function formReducer(state: FormReducerState, action: Action) {
  switch (action.type) {
    /**
     * Replaces markdown texts (texts starting with #) with computed values
     */
    case 'REPLACE_MARKDOWN_TEXT': {
      return replaceMarkdownText(state);
    }

    /**
     * Counts the number of main steps and saves it in the state.
     */
    case 'COUNT_MAIN_STEPS': {
      return computeNumberMainSteps(state);
    }

    /**
     * Forward to the next step in the form.
     */
    case 'GO_NEXT': {
      return goNext(state);
    }

    /**
     * Back to the previous step in the form.
     */
    case 'GO_BACK': {
      return goBack(state);
    }

    /**
     * Forward to the next step in the form.
     */
    case 'GO_DOWN': {
      return goDown(state, action.payload.targetStep);
    }

    /**
     * Back to the previous step in the form.
     */
    case 'GO_UP': {
      return goUp(state, action.payload.targetStep);
    }

    case 'GO_TO_MAIN_FORM': {
      return goBackToMainForm(state);
    }

    case 'START_FORM': {
      return startForm(state, action.payload);
    }

    case 'UPDATE_ANSWER': {
      return updateAnswer(state, action.payload);
    }

    case 'VALIDATE_ANSWER': {
      return validateAnswer(
        state,
        action.payload.answer,
        action.payload.id,
        action.payload.checkIfDirty
      );
    }

    case 'VALIDATE_ALL_STEP_ANSWERS': {
      return validateAllStepAnswers(
        state,
        action.payload.onErrorCallback,
        action.payload.onValidCallback
      );
    }

    case 'DIRTY_FIELD': {
      return dirtyField(state, action.payload.answer, action.payload.id);
    }

    /**
     * Action for handling the submission of form answers.
     */
    case 'SUBMIT_FORM': {
      return submitForm(state, action.payload);
    }

    /** Update the list of all questions */
    case 'GET_ALL_QUESTIONS': {
      return getAllQuestions(state);
    }

    default:
      return state;
  }
}

export default formReducer;
