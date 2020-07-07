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
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 16px;
  color: ${props => props.color};
  line-height: 20px;
  letter-spacing: 0.5px;
`;

const StepDescriptionHeading = styled(Heading)`
  font-size: 30px;
  line-height: 40px;
  color: ${props => props.color};
`;

const StepDescriptionText = styled(Text)`
  font-size: 16px;
  margin-top: 16px;
  color: ${props => props.color};
  line-height: 25px;
`;

function StepDescription({ style, theme, tagline, heading, text }) {
  return (
    <StepDescriptionWrapper style={style}>
      {tagline.length > 0 && (
        <StepDescriptionTagline color={theme.step.text.colors.secondary}>
          {tagline}
        </StepDescriptionTagline>
      )}
      <StepDescriptionHeading color={theme.step.text.colors.primary}>
        {heading}
      </StepDescriptionHeading>
      {text && (
        <StepDescriptionText color={theme.step.text.colors.primary}>{text}</StepDescriptionText>
      )}
    </StepDescriptionWrapper>
  );
}

StepDescription.propTypes = {
  style: PropTypes.object,
  tagline: PropTypes.string,
  heading: PropTypes.string.isRequired,
  text: PropTypes.string,
  theme: PropTypes.shape({
    step: PropTypes.shape({
      text: PropTypes.shape({
        colors: PropTypes.shape({
          primary: PropTypes.string,
          secondary: PropTypes.string,
        }),
      }),
    }),
  }),
};

StepDescription.defaultProps = {
  tagline: null,
  text: null,
  theme: {
    step: {
      text: {
        colors: {
          primary: '#00213f',
          secondary: '#733232',
        },
      },
    },
  },
};

export default StepDescription;
