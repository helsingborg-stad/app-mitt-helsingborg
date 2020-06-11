/**
 * Action Types
 */

/** @type { string } */
export const REPLACE_FIRSTNAME_MARKDOWN_IN_ALL_STEP_TITLES =
  'REPLACE_FIRSTNAME_MARKDOWN_IN_ALL_STEP_TITLES';

/** @type { string } */
export const INCREASE_COUNTER = 'INCREASE_COUNTER';

/** @type { string } */
export const DECREASE_COUNTER = 'DECREASE_COUNTER';

/** @type { object } */
export const actions = {
  increaseCounter: INCREASE_COUNTER,
  decreaseCounter: DECREASE_COUNTER,
  replaceFirstNameMarkdownInAllStepTitles: REPLACE_FIRSTNAME_MARKDOWN_IN_ALL_STEP_TITLES,
};

/**
 * Action for replacing title markdown in steps.
 * @param {object} state the current state of the form
 */
export function replaceFirstNameMarkdownInAllStepTitles(state) {
  const { steps, user } = state;
  const updatedSteps = steps.map(s => ({
    ...s,
    title: s.title.replace('#firstName', user.firstName),
  }));
  return {
    ...state,
    steps: updatedSteps,
  };
}
