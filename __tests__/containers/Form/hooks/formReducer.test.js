import formReducer from 'app/containers/Form/hooks/formReducer';
import {
  INCREASE_COUNTER,
  DECREASE_COUNTER,
  UPDATE_ANSWER,
  REPLACE_FIRSTNAME_MARKDOWN_IN_ALL_STEP_TITLES,
  START_FORM,
  SUBMIT_FORM,
} from 'app/containers/Form/hooks/formActions';

const initialState = {
  submitted: false,
  counter: 1,
  steps: [
    {
      title: 'First step with name #firstName',
    },
    {
      title: 'Second step',
    },
    {
      title: 'Third step',
    },
  ],
  user: {
    firstName: 'Gandalf Ståhl',
  },
  formAnswers: {},
};

test(`dispatch:default - should return state as it is`, async () => {
  const state = formReducer(initialState, {});

  expect(state).toEqual(initialState);
});

test(`dispatch:${REPLACE_FIRSTNAME_MARKDOWN_IN_ALL_STEP_TITLES} - should replace #firstName in title in first step`, async () => {
  const state = formReducer(initialState, { type: REPLACE_FIRSTNAME_MARKDOWN_IN_ALL_STEP_TITLES });

  expect(state.steps[0].title).toContain(initialState.user.firstName);
});

test(`dispatch:${INCREASE_COUNTER} - should increment counter by one`, async () => {
  const state = formReducer(initialState, { type: INCREASE_COUNTER });
  //   const state = AuthReducer(initialState, loginSuccess());

  expect(state.counter).toEqual(initialState.counter + 1);
});

test(`dispatch:${INCREASE_COUNTER} - should not increment counter since we are in the last step`, async () => {
  const state = formReducer(
    {
      ...initialState,
      counter: initialState.steps.length,
    },
    { type: INCREASE_COUNTER }
  );

  expect(state.counter).toEqual(initialState.steps.length);
});

test(`dispatch:${DECREASE_COUNTER} - should decrement counter by one`, async () => {
  const state = formReducer(
    {
      ...initialState,
      counter: initialState.steps.length,
    },
    { type: DECREASE_COUNTER }
  );
  //   const state = AuthReducer(initialState, loginSuccess());

  expect(state.counter).toEqual(initialState.steps.length - 1);
});

test(`dispatch:${DECREASE_COUNTER} - should not decrement counter since we are in the first step`, async () => {
  const state = formReducer(
    {
      ...initialState,
      counter: 1,
    },
    { type: DECREASE_COUNTER }
  );
  //   const state = AuthReducer(initialState, loginSuccess());

  expect(state.counter).toEqual(1);
});

test(`dispatch:${START_FORM} - Should increment counter by one and call defined callback which returns an object`, async () => {
  const initialSideEffectValue = 'Initial value';
  let sideEffectValue = initialSideEffectValue;

  const sideEffectCallback = param => {
    sideEffectValue = param;
  };

  const state = formReducer(initialState, {
    type: START_FORM,
    payload: {
      callback: sideEffectCallback,
    },
  });

  expect(state.counter).toEqual(initialState.counter + 1);
  expect(sideEffectValue).not.toEqual(initialSideEffectValue);
});

test(`dispatch:${SUBMIT_FORM} - Should set submitted to true and call defined callback which should return formAnswers object`, async () => {
  let sideEffectValue = false;

  const sideEffectCallback = param => {
    sideEffectValue = param;
  };

  const state = formReducer(initialState, {
    type: SUBMIT_FORM,
    payload: {
      callback: sideEffectCallback,
    },
  });

  expect(state.submitted).toEqual(true);
  expect(sideEffectValue).toEqual(initialState.formAnswers);
});

test(`dispatch:${UPDATE_ANSWER} - Should update formAnswers object`, async () => {
  const updateAnswerValue = {
    newAnswer: 'Answer value',
  };
  const state = formReducer(initialState, {
    type: UPDATE_ANSWER,
    payload: updateAnswerValue,
  });

  expect(state.formAnswers).toEqual({ ...initialState.formAnswers, ...updateAnswerValue });
});
