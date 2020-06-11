import { actions, replaceFirstNameMarkdownInAllStepTitles } from './formActions';

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
    case actions.increaseCounter:
      break;
    case actions.decreaseCounter:
      break;
    case actions.replaceFirstNameMarkdownInAllStepTitles: {
      return replaceFirstNameMarkdownInAllStepTitles(state);
    }
    default:
      return state;
  }
}

export default formReducer;
