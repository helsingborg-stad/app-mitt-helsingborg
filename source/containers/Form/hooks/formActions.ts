import { increaseCount, decreaseCount } from '../../../helpers/Counter';
import { replaceMarkdownTextInSteps } from './textReplacement';
import { FormReducerState } from './useForm';

/**
 * Action for replacing title markdown in steps.
 * @param {FormReducerState} state the current state of the form
 */
export function replaceMarkdownText(state: FormReducerState) {
  const { steps, user } = state;
  const updatedSteps = replaceMarkdownTextInSteps(steps, user);
  return {
    ...state,
    steps: updatedSteps,
  };
}

/**
 * Action for decreasing the form counter.
 * @param {FormReducerState} state the current state of the form
 */
export function decreaseFormCounter(state: FormReducerState) {
  const { counter } = state;
  return {
    ...state,
    counter: decreaseCount(counter, 0),
  };
}

/**
 * Action for increasing the form counter.
 * @param {FormReducerState} state the current state of the form
 */
export function increaseFormCounter(state: FormReducerState) {
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
export function startForm(state: FormReducerState, payload: { callback: () => void }) {
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
 * @param {FormReducerState} state the current state of the form
 */
export function submitForm(
  state: FormReducerState,
  payload: { callback: (formAnswers: Record<string, any>) => void }
) {
  payload.callback(state.formAnswers);
  return { ...state, submitted: true };
}

/**
 * Action for updating the answers in the form state.
 * @param {FormReducerState} state The current state of the form
 * @param {Record<string, any>} answer The new answer(s): an object with key:value pairs, to be inserted into the states formAnswers
 */
export function updateAnswer(state: FormReducerState, answer: Record<string, any>) {
  // make a deep copy of the formAnswers, and use that to update. Not sure if completely needed.
  const updatedAnswers: Record<string, any> = JSON.parse(JSON.stringify(state.formAnswers));
  Object.keys(answer).forEach(key => (updatedAnswers[key] = answer[key]));

  return {
    ...state,
    formAnswers: updatedAnswers,
  };
}
