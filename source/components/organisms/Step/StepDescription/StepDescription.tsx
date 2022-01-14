import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Text, Heading } from '../../../atoms';

const StepDescriptionWrapper = styled.View`
  padding-left: 24px;
  padding-right: 24px;
  margin-top: 50px;
`;

const StepDescriptionContent = styled.View``;

const StepDescriptionTagline = styled(Text)`
  font-size: ${(props) => props.theme.typography[props.type].fontSize}px;
  font-weight: bold;
  margin-bottom: 12px;
  color: ${(props) => props.theme.colors.primary[props.colorSchema][1]};
  line-height: ${(props) => props.theme.typography[props.type].lineHeight}px;
  letter-spacing: 0.5px;
`;

const StepDescriptionText = styled(Text)`
  line-height: ${(props) => props.theme.typography[props.type].lineHeight}px;
  margin-top: 16px;
  font-size: ${(props) => props.theme.fontSizes[3]}px;
`;

function StepDescription({
  style,
  tagline,
  heading,
  text,
  colorSchema,
  currentStep,
  totalStepNumber,
}) {
  return (
    <StepDescriptionWrapper style={style}>
      <StepDescriptionContent>
        {tagline.length !== 0 && (
          <StepDescriptionTagline colorSchema={colorSchema}>
            {tagline}

            {tagline && currentStep && totalStepNumber && currentStep !== totalStepNumber && ' • '}
            {currentStep &&
              totalStepNumber &&
              currentStep !== totalStepNumber &&
              `${currentStep} / ${totalStepNumber}`}
          </StepDescriptionTagline>
        )}
        <Heading>{heading}</Heading>
        {text.length !== 0 && <StepDescriptionText>{text}</StepDescriptionText>}
      </StepDescriptionContent>
    </StepDescriptionWrapper>
  );
}

StepDescription.propTypes = {
  style: PropTypes.object,
  tagline: PropTypes.string,
  heading: PropTypes.string.isRequired,
  text: PropTypes.string,
  /** Current main step in the form */
  currentStep: PropTypes.number,
  /** Total number of main steps in the form */
  totalStepNumber: PropTypes.number,
  /**
   * The color schema for the description,
   */
  colorSchema: PropTypes.oneOf(['blue', 'red', 'purple', 'green', 'neutral']),
};

StepDescription.defaultProps = {
  tagline: '',
  text: '',
  colorSchema: 'blue',
  style: {},
};

export default StepDescription;
