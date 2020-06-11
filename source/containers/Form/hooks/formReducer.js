import {
  actionTypes,
  replaceFirstNameMarkdownInAllStepTitles,
  increaseFormCounter,
  decreaseFormCounter,
} from './formActions';
import { increaseCount, decreaseCount } from '../../../helpers/Counter';

/**
 * The formReducer is a pure function that takes the previous state and an action, and returns the
 * next state. (previousState, action) => nextState. It's called a reducer because it's the type
 * of function you would pass to Array.
 * @param {object} state
 * @param {object} action
 */
function formReducer(state, action) {
  const { type } = action;

  switch (type) {
    case actionTypes.REPLACE_FIRSTNAME_MARKDOWN_IN_ALL_STEP_TITLES: {
      return replaceFirstNameMarkdownInAllStepTitles(state);
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

    default:
      return state;
  }
}

export default formReducer;
