import { increaseCount, decreaseCount } from '../../../helpers/Counter';
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

/** @type { string } */
export const START_FORM = 'START_FORM';

/** @type { string } */
export const UPDATE_ANSWER = 'UPDATE_ANSWER';

/** @type { object } */
export const actionTypes = {
  INCREASE_COUNTER,
  DECREASE_COUNTER,
  UPDATE_ANSWER,
  REPLACE_FIRSTNAME_MARKDOWN_IN_ALL_STEP_TITLES,
  START_FORM,
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

/**
 * Action for decreasing the form counter.
 * @param {object} state the current state of the form
 */
export function decreaseFormCounter(state) {
  const { counter } = state;
  return {
    ...state,
    counter: decreaseCount(counter, 0),
  };
}

/**
 * Action for increasing the form counter.
 * @param {object} state the current state of the form
 */
export function increaseFormCounter(state) {
  const { steps, counter } = state;
  return {
    ...state,
    counter: increaseCount(counter, steps.length),
  };
}

/**
 * Action to run when starting a form.
 * @param {object} state the current state of the form
 */
export function startForm(state, payload) {
  // TODO: Pass user input values.
  payload.callback({});
  const { steps, counter } = state;
  return {
    ...state,
    counter: increaseCount(counter, steps.length),
  };
}

/**
 * Action to run when starting a form.
 * @param {object} state the current state of the form
 */
export function submitForm(state, payload) {
  payload.callback(state.formAnswers);
  return { ...state, submitted: true };
}

/**
 * Action for updating the answers in the form state.
 * @param {object} state The current state of the form
 * @param {object} answer The new answer(s): an object with key:value pairs, to be inserted into the states formAnswers
 */
export function updateAnswer(state, answer) {
  // make a deep copy of the formAnswers, and use that to update. Not sure if completely needed.
  const updatedAnswers = JSON.parse(JSON.stringify(state.formAnswers));
  Object.keys(answer).forEach(key => (updatedAnswers[key] = answer[key]));

  console.log(answer);

  return {
    ...state,
    formAnswers: updatedAnswers,
  };
}
