const actions = {
  increaseCounter: 'INCREASE_COUNTER',
  decreaseCounter: 'DECREASE_COUNTER',
};

function formReducer(state, action) {
  const { type, payload } = action;

  switch (action.type) {
    case actions.increaseCounter:
      break;
    case actions.decreaseCounter:
      break;
    default:
      break;
  }
}

export default formReducer;
