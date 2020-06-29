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

/** @type { string } */
export const SUBMIT_FORM = 'SUBMIT_FORM';

/** @type { object } */
export const actionTypes = {
  INCREASE_COUNTER,
  DECREASE_COUNTER,
  UPDATE_ANSWER,
  REPLACE_FIRSTNAME_MARKDOWN_IN_ALL_STEP_TITLES,
  START_FORM,
  SUBMIT_FORM,
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
 * Action for updating information.
 */
export function updateAnswer(state, answer) {
  const { formAnswer } = state;
  let updateAnswer = formAnswer;

  if (Object.prototype.hasOwnProperty.call(updateAnswer, Object.keys(answer))) {
    updateAnswer[Object.keys(answer)] = Object.values(answer);
  } else {
    updateAnswer = { ...formAnswer, ...answer };
  }

  return {
    ...state,
    formAnswer: updateAnswer,
  };
}
