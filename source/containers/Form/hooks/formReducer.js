export const actions = {
  increaseCounter: 'INCREASE_COUNTER',
  decreaseCounter: 'DECREASE_COUNTER',
  setFirstNameInStepTitles: 'SET_NAME_IN_STEP_TITLES',
};

function formReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case actions.increaseCounter:
      break;
    case actions.decreaseCounter:
      break;
    case actions.setFirstNameInStepTitles: {
      const { steps, user } = state;
      const updatedSteps = steps.map(s => ({
        ...s,
        title: s.title.replace('#firstName', user.givenName),
      }));
      return {
        ...state,
        steps: updatedSteps,
      };
    }
    default:
      return state;
  }
}

export default formReducer;
