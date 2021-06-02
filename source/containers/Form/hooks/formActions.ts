import { Question, StepperActions } from '../../../types/FormTypes';
import { replaceMarkdownTextInSteps } from './textReplacement';
import { FormReducerState } from './useForm';
import { validateInput } from '../../../helpers/ValidationHelper';
import { evaluateConditionalExpression } from '../../../helpers/conditionParser';

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
        currentMainStepIndex: currentPosition.level === 0 ? nextIndex : currentPosition.currentMainStepIndex,
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
        currentMainStepIndex: currentPosition.level === 0 ? backIndex : currentPosition.currentMainStepIndex,
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
 * Goes back to the main form. Can be thought of as 'closing' the substep modal.
 * @param state current form state
 */
export function goBackToMainForm(state: FormReducerState) {
  const { currentPosition } = state;
  return {
    ...state,
    currentPosition: {...currentPosition, index: currentPosition.currentMainStepIndex, level: 0 }
  }
}

export function goBackToMainFormAndNext(state: FormReducerState) {
  const { connectivityMatrix, currentPosition } = state;

  const newPosition = {...currentPosition, index: currentPosition.currentMainStepIndex, level: 0};
  const nextIndex = getNextIndex(connectivityMatrix, newPosition);
  if (nextIndex >= 0) {
    return {
      ...state,
      currentPosition: {
        index: nextIndex,
        level: 0,
        currentMainStep:
          state.currentPosition.currentMainStep + 1,
        currentMainStepIndex: nextIndex,
      },
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

/** Action for updating the list of all questions in the form state. */
export function getAllQuestions(state: FormReducerState) {
  const allQuestions: Question[] = [];
  state.steps.forEach(step => { if (step.questions) allQuestions.push(...step.questions)})
  return {
    ...state,
    allQuestions,
  }
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
 * @param checkIfDirty whether to only validate if the field is dirty or not.
 */
export function validateAnswer(
  state: FormReducerState,
  answer: Record<string, any>,
  questionId: string,
  checkIfDirty: boolean = false,
) {
  const { allQuestions } = state;

  // Return if question or question ID is undefined.
  if (!allQuestions || !questionId) return state;

  const question = allQuestions.find(q => q.id === questionId);
  if (!question) return state;

  if (['text', 'number', 'date', 'checkbox', 'select'].includes(question.type)) {
    const { validation } = question;
    if (validation && ((checkIfDirty && state.dirtyFields?.[questionId]) || !checkIfDirty)) {
      const [isValid, validationMessage] = validateInput(answer[questionId], validation.rules);
      return {
        ...state,
        validations: {
          ...state.validations,
          [questionId]: { isValid, message: validationMessage },
        },
      };
    }
  }
  if (question.type === 'editableList') {
    const validationResults: Record<string, {isValid:boolean, validationMessage: string}> = {};
    question.inputs.forEach(input => {
      if (input.validation && ((checkIfDirty && state.dirtyFields?.[questionId]?.[input.key]) || !checkIfDirty)) {
        const [isValid, validationMessage] = validateInput(
          answer?.[questionId]?.[input?.key],
          input.validation.rules
        );
        validationResults[input.key] = { isValid, validationMessage };
      }
    });
    return {
      ...state,
      validations: {
        ...state.validations,
        [questionId]: validationResults,
      },
    };
  }
  if (question.type === 'repeaterField') {
    const validationResults: Record<string, {isValid:boolean, validationMessage: string}>[] = [];
    if (answer[questionId]?.length > 0){
      (answer[questionId] as Record<string, string>[]).forEach((a,index) => {
        const localValidationResults = {};
        question.inputs.forEach(input => {
          if(input.validation && a[input.id] !== undefined && ((checkIfDirty && state.dirtyFields?.[questionId]?.[index]?.[input.id]) || !checkIfDirty)){
            const [isValid, validationMessage] = validateInput(a[input.id], input.validation.rules);
            localValidationResults[input.id] = { isValid, validationMessage};
          }
        });
        validationResults.push(localValidationResults);
      });
    }
    return {
      ...state,
      validations: {
        ...state.validations,
        [questionId]: validationResults,
      },
    };
  }
  return state;
}

const recursiveValidationReducer = (isValidAccumulator: boolean, item: any) : boolean => {
  if (!isValidAccumulator) return false;
  const { isValid } = item;
  
  if (isValid === undefined) {
    const nestedValidationArray = Array.isArray(item) ? item : Object.values(item);
    return nestedValidationArray.reduce(recursiveValidationReducer, isValidAccumulator);
  }

  return isValid;
}

/**
 * Shall validate all inputs in a step that have validation rules.
 * Callbacks can be passed for handling validation fail and succeed.
 *
 * Function will first collect all inputs for current step and then validate
 * each and every input.
 * Once done, a callback will be called for failed (errors found) or success (all inputs valid).
 *
 * @param state             State of current form.
 * @param onErrorCallback   Called when validation failed for an input field.
 * @param onValidCallback   Called when all field validated successfully.
 */
export function validateAllStepAnswers( state: FormReducerState, onErrorCallback: () => void, onValidCallback: () => void ) {
  // Collect all questions.
  const currentStepIndex = state.currentPosition.index;
  const currentStepQuestions = state.steps[currentStepIndex].questions;
  let allInputsValid = true;

  if (!currentStepQuestions || currentStepQuestions.length === 0) {
    onValidCallback();
    return state
  }

  // Set dirtyFields for handling input onFocus.
  let dirtyFields = {}
  
  // Validate all question inputs.
  state.validations = {};
  currentStepQuestions.forEach((question: any) => {
    const { type, items } = question;
    let itemsToValidate = [question];

    if (type === 'summaryList') {
      itemsToValidate = items?.length > 0 ? items : [];
    }

    if (itemsToValidate.length > 0) {
      itemsToValidate.forEach(validationItem => {
        let shouldValidate = true;
        const answer = state.formAnswers[validationItem.id] || '';
        dirtyFields[validationItem.id] = true;

        if(validationItem.hasCondition && validationItem.conditionalOn) {
          shouldValidate = evaluateConditionalExpression(validationItem.conditionalOn, state.formAnswers, state.allQuestions);
        }

        if(shouldValidate) {
          state = validateAnswer(state, { [validationItem.id]: answer }, validationItem.id);
        }
      }) 
    }
  });

  const validationArray = Object.values(state.validations);
  if (validationArray.length > 0) {
    allInputsValid = validationArray.reduce(recursiveValidationReducer, allInputsValid);
  }

  // Handle callbacks.
  if (allInputsValid) {
    if (onValidCallback) onValidCallback();
  } else {
    if (onErrorCallback) onErrorCallback();
  }

  return {
    ...state,
    dirtyFields: {
      ...state.dirtyFields = dirtyFields
    },
    allInputsValid
  }
}

/**
 * Dirty a field, i.e. mark that it's been touched by the user. Used for validation.
 *
 * @param state State of current form.
 * @param answer User input / question.
 * @param questionId  Id of answered question.
 */
export function dirtyField(
  state: FormReducerState,
  answer: Record<string, any>,
  questionId: string
) {
  const { allQuestions } = state;
  // Return if question or question ID is undefined.
  if (!allQuestions || !questionId) return state;

  const question = allQuestions.find(q => q.id === questionId);
  if (!question) return state;

  if (['text', 'number', 'date', 'checkbox', 'select'].includes(question.type)) {
    return {
      ...state,
      dirtyFields: {
        ...state.dirtyFields,
        [questionId]: true,
      },
    };
  }
  if (question.type === 'editableList') {
    const inputs: Record<string, boolean> = {};
    question.inputs.forEach(input => {
      if (input.validation && answer[questionId][input.key] !== undefined) {
        inputs[input.key] = true;
      }
    });
    return {
      ...state,
      dirtyFields: {
        ...state.dirtyFields,
        [questionId]: inputs,
      },
    };
  }
  if (question.type === 'repeaterField') {
    const inputs: Record<string, boolean>[] = [];
    if (answer[questionId]?.length > 0){
      (answer[questionId] as Record<string, string>[]).forEach(a => {
        const localDirtyFields: Record<string, boolean> = {};
        question.inputs.forEach(input => {
          if(input.validation && a[input.id] !== undefined){
            localDirtyFields[input.id] = true;
          }
        });
        inputs.push(localDirtyFields);
      });
    }
    return {
      ...state,
      dirtyFields: {
        ...state.dirtyFields,
        [questionId]: inputs,
      },
    };
  }
  return state;
}

export const createSnapshot = (state: FormReducerState) => ({
  ...state,
  formAnswerSnapshot: JSON.parse(JSON.stringify(state.formAnswers)),
});

export const restoreSnapshot = (state: FormReducerState) => {
  if (Object.entries(state.formAnswerSnapshot).length <= 0) {
    return state;
  }

  if (JSON.stringify(state.formAnswers) === JSON.stringify(state.formAnswerSnapshot)) {
    return state;
  }

  return {
    ...state,
    formAnswers: JSON.parse(JSON.stringify(state.formAnswerSnapshot)),
    formAnswerSnapshot: {},
  };
}

export const deleteSnapshot = (state: FormReducerState) => ({
  ...state,
  formAnswerSnapshot: {},
});