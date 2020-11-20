import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import styled from 'styled-components';

const ProgressbarBox = styled(View) <{ percentage: number, rounded: boolean, colorSchema: string }>`
  ${({ rounded }) => rounded && `border-radius: 50px;`}
  height: 100%;
  background-color: ${props =>
    props.colorSchema === 'neutral'
      ? props.theme.colors.neutrals[2]
      : props.theme.colors.primary[props.colorSchema][3]};
  opacity: 2;
  width: ${props => props.percentage}%;
`;

const ProgressbarBackground = styled(View) <{ rounded: boolean, colorSchema: string }>`
  ${({ rounded }) => rounded && `border-radius: 50px;`}
  background-color: ${props =>
    props.colorSchema === 'neutral'
      ? `${props.theme.colors.neutrals[0]}1F`
      : props.theme.colors.complementary[props.colorSchema][3]};
  height: 3px;
  width: 100%;
`;

interface Props {
  currentStep: number;
  totalStepNumber: number;
}

/** Simple progressbar, fills out a grey box to show the completed percentage */
const Progressbar: React.FC<Props> = ({ currentStep, colorSchema, totalStepNumber, ...props }) => {
  const percentage = (100 * currentStep) / totalStepNumber;
  return (
    <ProgressbarBackground colorSchema={colorSchema} {...props}>
      <ProgressbarBox colorSchema={colorSchema} percentage={percentage} {...props} />
    </ProgressbarBackground>
  );
};

Progressbar.propTypes = {
  /** Current step in the main flow */
  currentStep: PropTypes.number.isRequired,
  /** Total number of steps in the main flow */
  totalStepNumber: PropTypes.number.isRequired,
  colorSchema: PropTypes.oneOf(['neutral', 'blue', 'red', 'purple', 'green']),
};

Progressbar.defaultProps = {
  colorSchema: 'neutral',
};


export default Progressbar;
