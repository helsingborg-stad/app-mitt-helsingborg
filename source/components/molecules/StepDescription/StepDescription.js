import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Text, Heading } from 'app/components/atoms';

const StepDescriptionWrapper = styled.View`
  margin-left: 25px;
  margin-top: 76px;
  margin-bottom: 48px;
  width: 285px;
`;

const StepDescriptionTagline = styled(Text)`
  font-size: ${props => props.theme.typography[props.type].fontSize}px;
  font-weight: bold;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.primary[props.colorSchema][1]};
  line-height: ${props => props.theme.typography[props.type].lineHeight}px;
  letter-spacing: 0.5px;
`;

const StepDescriptionText = styled(Text)`
  line-height: ${props => props.theme.typography[props.type].lineHeight}px;
  margin-top: 16px;
`;

function StepDescription({ style, tagline, heading, text, colorSchema }) {
  return (
    <StepDescriptionWrapper style={style}>
      {tagline.length !== 0 && (
        <StepDescriptionTagline colorSchema={colorSchema}>{tagline}</StepDescriptionTagline>
      )}
      <Heading>{heading}</Heading>
      {text.length !== 0 && <StepDescriptionText>{text}</StepDescriptionText>}
    </StepDescriptionWrapper>
  );
}

StepDescription.propTypes = {
  style: PropTypes.object,
  tagline: PropTypes.string,
  heading: PropTypes.string.isRequired,
  text: PropTypes.string,
  /**
   * The color schema for the description,
   */
  colorSchema: PropTypes.oneOf(['blue', 'red', 'purple', 'green']),
};

StepDescription.defaultProps = {
  tagline: '',
  text: '',
  colorSchema: 'blue',
  style: {},
};

export default StepDescription;
