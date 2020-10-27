import { StepperActions } from '../../../types/FormTypes';
import { replaceMarkdownTextInSteps } from './textReplacement';
import { FormReducerState } from './useForm';
import { validateInput } from '../../../helpers/ValidationHelper';

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

const getConnectionIndex = (
  matrix: StepperActions[][],
  currentIndex: number,
  conn: StepperActions
) => matrix[currentIndex].findIndex(val => val === conn);

function getIndex(state: FormReducerState, stepId: string) {
  return state.steps.findIndex(s => s.id === stepId);
}
function getNextIndex(
  matrix: StepperActions[][],
  currentPosition: { index: number; level: number }
) {
  return getConnectionIndex(matrix, currentPosition.index, 'next');
}
function getBackIndex(
  matrix: StepperActions[][],
  currentPosition: { index: number; level: number }
) {
  return getConnectionIndex(matrix, currentPosition.index, 'back');
}
function getNestedSteps(
  matrix: StepperActions[][],
  currentPosition: { index: number; level: number }
): number[] {
  return matrix[currentPosition.index].reduce((prev, curr, currIndex) => {
    if (curr === 'down') return [currIndex, ...prev];
    return prev;
  }, []);
}
function getParentSteps(
  matrix: StepperActions[][],
  currentPosition: { index: number; level: number }
): number[] {
  return matrix[currentPosition.index].reduce((prev, curr, currIndex) => {
    if (curr === 'up') return [currIndex, ...prev];
    return prev;
  }, []);
}
/** computes and sets the number of main steps in the form. Sets it to -1 if it encounters an infinite loop */
export function computeNumberMainSteps(state: FormReducerState) {
  const { connectivityMatrix } = state;
  const countNext = (m: StepperActions[][], currentRow: number, history: number[]) => {
    const nextIndex = m[currentRow].findIndex(a => a === 'next');
    if (history.includes(nextIndex)) return 1;
    return nextIndex >= 0 ? 2 + countNext(m, nextIndex, [...history, nextIndex]) : 2;
  };
  const count = countNext(connectivityMatrix, 0, []);
  return {
    ...state,
    numberOfMainSteps: count % 2 === 0 ? count / 2 : -1,
  };
}

/** Go to the next step in the form. If you are in a nested step with no further next, then this will go up to the parent. */
export function goNext(state: FormReducerState) {
  const { connectivityMatrix, currentPosition } = state;
  const nextIndex = getNextIndex(connectivityMatrix, currentPosition);
  if (nextIndex >= 0) {
    return {
      ...state,
      currentPosition: {
        index: nextIndex,
        level: currentPosition.level,
        currentMainStep:
          state.currentPosition.currentMainStep + (currentPosition.level === 0 ? 1 : 0),
      },
    };
  }
  // if we have no next, then look for an up and if that exists, go there instead.
  const upIndex = getConnectionIndex(connectivityMatrix, currentPosition.index, 'up');
  if (upIndex >= 0) {
    return {
      ...state,
      currentPosition: { ...currentPosition, index: upIndex, level: currentPosition.level - 1 },
    };
  }
  return { ...state };
}
/** Go to the previous step in the form. If you are in a nested step with no further back, then this will go up to the parent. */
export function goBack(state: FormReducerState) {
  const { connectivityMatrix, currentPosition } = state;
  const backIndex = getBackIndex(connectivityMatrix, currentPosition);
  if (backIndex >= 0) {
    return {
      ...state,
      currentPosition: {
        ...currentPosition,
        index: backIndex,
        currentMainStep:
          state.currentPosition.currentMainStep - (currentPosition.level === 0 ? 1 : 0),
      },
    };
  }
  // if we have no back, then look for an up and if that exists, go there instead.
  const upIndex = getConnectionIndex(connectivityMatrix, currentPosition.index, 'up');
  if (upIndex >= 0) {
    return {
      ...state,
      currentPosition: { ...currentPosition, index: upIndex, level: currentPosition.level - 1 },
    };
  }
  return { ...state };
}

/**
 * Goes down in to a nested child step. Will only allow jumping to a connected step.
 * @param state current form state
 * @param targetStep the id or index of the target step.
 */
export function goDown(state: FormReducerState, targetStep: number | string) {
  const { connectivityMatrix, currentPosition } = state;
  const index = typeof targetStep === 'number' ? targetStep : getIndex(state, targetStep);

  if (getNestedSteps(connectivityMatrix, currentPosition).includes(index)) {
    return {
      ...state,
      currentPosition: { ...currentPosition, index, level: currentPosition.level + 1 },
    };
  }
}
/**
 * Goes up into a parent step. Will only allow jumping to a connected step.
 * @param state current form state
 * @param targetStep the id or index of the target step.
 */
export function goUp(state: FormReducerState, targetStep: number | string) {
  const { connectivityMatrix, currentPosition } = state;
  const index = typeof targetStep === 'number' ? targetStep : getIndex(state, targetStep);

  if (getParentSteps(connectivityMatrix, currentPosition).includes(index)) {
    return {
      ...state,
      currentPosition: { ...currentPosition, index, level: currentPosition.level - 1 },
    };
  }
}

/**
 * Action to run when starting a form.
 * @param {object} state the current state of the form
 */
export function startForm(state: FormReducerState, payload: { callback: () => void }) {
  // TODO: Pass user input values.
  payload.callback();
  return {
    ...state,
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

/**
 * Validate user form answers.
 *
 * Shall check validation for user answers and return object with ID and validation result. ID will correspond
 * question validated.
 *
 * @param state State of current form.
 * @param answer User input / question.
 * @param questionId  Id of answered question.
 */
export function validateAnswer(
  state: FormReducerState,
  answer: Record<string, any>,
  questionId: string
) {
  const { questions } = state.steps[state.currentPosition.index];

  const { validation } = questions.find(question => question.id === questionId);

  if (validation) {
    const [isValid, validationMessage] = validateInput(answer[questionId], validation.rules);

    return {
      ...state,
      validations: { ...state.validations, [questionId]: { isValid, message: validationMessage } },
    };
  }

  return state;
}
