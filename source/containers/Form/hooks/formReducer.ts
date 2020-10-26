import { FormReducerState } from './useForm';
import {
  replaceMarkdownText,
  goNext,
  goBack,
  goDown,
  goUp,
  startForm,
  submitForm,
  updateAnswer,
  computeNumberMainSteps,
} from './formActions';

type Action =
  | {
      type: 'REPLACE_MARKDOWN_TEXT';
    }
  | {
      type: 'COUNT_MAIN_STEPS';
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
      type: 'START_FORM';
      payload: { callback: () => void };
    }
  | {
      type: 'UPDATE_ANSWER';
      payload: Record<string, any>;
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

    case 'START_FORM': {
      return startForm(state, action.payload);
    }

    case 'UPDATE_ANSWER': {
      return updateAnswer(state, action.payload);
    }

    /**
     * Action for handling the submission of form answers.
     */
    case 'SUBMIT_FORM': {
      return submitForm(state, action.payload);
    }

    default:
      return state;
  }
}

export default formReducer;
