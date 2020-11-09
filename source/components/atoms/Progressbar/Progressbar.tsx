import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import styled from 'styled-components';

const ProgressbarBox = styled(View)<{ percentage: number }>`
  height: 3px;
  background-color: ${props => props.theme.colors.neutrals[2]};
  opacity: 2;
  width: ${props => props.percentage}%;
`;
const ProgressbarBackground = styled(View)`
  height: 3px;
  background-color: ${props => props.theme.colors.neutrals[0]}1F;
  width: 100%;
`;

interface Props {
  currentStep: number;
  totalStepNumber: number;
}

/** Simple progressbar, fills out a grey box to show the completed percentage */
const Progressbar: React.FC<Props> = ({ currentStep, totalStepNumber }) => {
  const percentage = (100 * currentStep) / totalStepNumber;
  return (
    <ProgressbarBackground>
      <ProgressbarBox percentage={percentage} />
    </ProgressbarBackground>
  );
};

Progressbar.propTypes = {
  /** Current step in the main flow */
  currentStep: PropTypes.number.isRequired,
  /** Total number of steps in the main flow */
  totalStepNumber: PropTypes.number.isRequired,
};

export default Progressbar;
