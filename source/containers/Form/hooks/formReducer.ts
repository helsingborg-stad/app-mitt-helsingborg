import { FormReducerState } from './useForm';
import {
  replaceMarkdownText,
  increaseFormCounter,
  decreaseFormCounter,
  startForm,
  submitForm,
  updateAnswer,
} from './formActions';

type Action =
  | {
      type: 'REPLACE_MARKDOWN_TEXT';
    }
  | {
      type: 'INCREASE_COUNTER';
    }
  | {
      type: 'DECREASE_COUNTER';
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
     * Incrementing the counter of the form based on the lenght of steps.
     * This allow going forward to the next step in the form.
     */
    case 'INCREASE_COUNTER': {
      return increaseFormCounter(state);
    }

    /**
     * Decrementing the counter of the form until it hits 0.
     * This allow going back to the previous step in the form.
     */
    case 'DECREASE_COUNTER': {
      return decreaseFormCounter(state);
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
