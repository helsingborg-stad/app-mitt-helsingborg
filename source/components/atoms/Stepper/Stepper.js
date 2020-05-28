import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

/**
 * Function to keep a number in a given range starting at 0.
 * @param {number} number The number to keep in range.
 * @param {number} range The lenght of the range to keep the number in.
 */
const keepNumberInRange = (number, range) => {
  let numberInRange = number || 1;

  if (numberInRange > range) {
    numberInRange = range;
  }

  if (numberInRange === 0) {
    numberInRange = 1;
  }

  return numberInRange;
};

/**
 * Functional atom component that can present a sequence of components
 */
function Stepper({ children, active }) {
  const countChildren = React.Children.count(children);

  /**
   * Keep the value of the prop current in the range of passed children.
   * if the value of current is higher than the amount of children we render the last child.
   */
  const activeInRange = keepNumberInRange(active, countChildren);
  const currentChildIndex = activeInRange - 1;

  const clonedChildren = React.Children.map(children, (child, index) =>
    React.cloneElement(child, { ...child.props, index })
  );

  return <View>{clonedChildren[currentChildIndex]}</View>;
}

Stepper.propTypes = {
  /**
   * The child node's provided to the Stepper.
   */
  children: PropTypes.node.isRequired,
  /**
   * The current active child that we want to render in the Stepper.
   */
  active: PropTypes.number,
};

Stepper.defaultProps = {
  active: 1,
};

export default Stepper;
