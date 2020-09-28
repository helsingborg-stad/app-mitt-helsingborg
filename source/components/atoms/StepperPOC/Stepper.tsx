import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Button from '../Button/Button';
import Text from '../Text/Text';
import { StepperActions } from '../../../types/FormTypes';

const StepperContainer = styled.View`
  flex: 1;
`;

interface Props {
  children: React.ReactNode;
  connectivityMatrix: StepperActions[][];
}

/**
 * Functional atom component that can present a sequence of components
 */
const Stepper: React.FC = ({ children, connectivityMatrix }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);

  const getConnectionIndex = (conn: StepperActions) =>
    connectivityMatrix[currentIndex].findIndex(val => val === conn);
  const getNextIndex = () => connectivityMatrix[currentIndex].findIndex(val => val === 'next');
  const getPreviousIndex = () => connectivityMatrix[currentIndex].findIndex(val => val === 'back');
  const getNestedSteps = (): number[] =>
    connectivityMatrix[currentIndex].reduce((prev, curr, currIndex) => {
      if (curr === 'down') return [currIndex, ...prev];
      return prev;
    }, []);
  const getParentSteps = (): number[] =>
    connectivityMatrix[currentIndex].reduce((prev, curr, currIndex) => {
      if (curr === 'up') return [currIndex, ...prev];
      return prev;
    }, []);

  const handleNext = () => {
    const nextIndex = getNextIndex();
    if (nextIndex >= 0) {
      setCurrentIndex(nextIndex);
    } else {
      const upIndex = getConnectionIndex('up');
      if (upIndex >= 0) {
        setCurrentIndex(upIndex);
        setCurrentLevel(currentLevel - 1);
      }
    }
  };

  const handleBack = () => {
    const prevIndex = getPreviousIndex();
    if (prevIndex >= 0) {
      setCurrentIndex(prevIndex);
    } else {
      const upIndex = getConnectionIndex('up');
      if (upIndex >= 0) {
        setCurrentIndex(upIndex);
        setCurrentLevel(currentLevel - 1);
      }
    }
  };

  const handleGoInto = (index: number) => {
    if (getNestedSteps().includes(index)) {
      setCurrentIndex(index);
      setCurrentLevel(currentLevel + 1);
    }
  };
  const handleGoOut = (index: number) => {
    if (getParentSteps().includes(index)) {
      setCurrentIndex(index);
      setCurrentLevel(currentLevel - 1);
    }
  };

  return (
    <StepperContainer>
      <Text>Current level: {currentLevel}</Text>
      <Text>Current step index: {currentIndex}</Text>
      {children[currentIndex]}
      <Text>Nested steps</Text>
      {getNestedSteps().map(i => (
        <Text>{i}</Text>
      ))}
      <Button onClick={handleNext}>
        <Text>Next</Text>
      </Button>
      <Button onClick={handleBack}>
        <Text>Back</Text>
      </Button>
      {getNestedSteps().map(index => (
        <Button onClick={() => handleGoInto(index)}>
          <Text>Go down a level {index}</Text>
        </Button>
      ))}
      {getParentSteps().map(index => (
        <Button onClick={() => handleGoOut(index)}>
          <Text>Go up a level {index}</Text>
        </Button>
      ))}
    </StepperContainer>
  );
};

Stepper.propTypes = {
  /**
   * The child node's provided to the Stepper.
   */
  children: PropTypes.node.isRequired,
};

Stepper.defaultProps = {
  active: 1,
};

export default Stepper;
