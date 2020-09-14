import {
  actionTypes,
  replaceMarkdownText,
  increaseFormCounter,
  decreaseFormCounter,
  startForm,
  submitForm,
  updateAnswer,
} from './formActions';

/**
 * The formReducer is a pure function that takes the previous state and an action, and returns the
 * next state. (previousState, action) => nextState. It's called a reducer because it's the type
 * of function you would pass to Array.
 * @param {object} state
 * @param {object} action
 */
function formReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    /**
     * Replaces markdown texts (texts starting with #) with computed values
     */
    case actionTypes.REPLACE_MARKDOWN_TEXT: {
      return replaceMarkdownText(state);
    }

    /**
     * Incrementing the counter of the form based on the lenght of steps.
     * This allow going forward to the next step in the form.
     */
    case actionTypes.INCREASE_COUNTER: {
      return increaseFormCounter(state);
    }

    /**
     * Decrementing the counter of the form until it hits 0.
     * This allow going back to the previous step in the form.
     */
    case actionTypes.DECREASE_COUNTER: {
      return decreaseFormCounter(state);
    }

    case actionTypes.START_FORM: {
      return startForm(state, payload);
    }

    case actionTypes.UPDATE_ANSWER: {
      return updateAnswer(state, payload);
    }

    /**
     * Action for handling the submission of form answers.
     */
    case actionTypes.SUBMIT_FORM: {
      return submitForm(state, payload);
    }

    default:
      return state;
  }
}

export default formReducer;
