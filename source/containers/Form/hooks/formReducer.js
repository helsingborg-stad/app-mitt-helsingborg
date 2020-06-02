const actions = {
  increaseCounter: 'INCREASE_COUNTER',
  decreaseCounter: 'DECREASE_COUNTER',
};

function formReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case actions.increaseCounter:
      break;
    case actions.decreaseCounter:
      break;
    default:
      return state;
  }
}

export default formReducer;
