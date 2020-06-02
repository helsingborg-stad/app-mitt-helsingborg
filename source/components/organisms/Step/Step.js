import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Text, Heading, Button } from '../../atoms';
import { BackNavigation, Banner, FooterAction } from '../../molecules';

const StepContainer = styled.View`
  background: ${props => props.bg}
  flex: 1;
`;

const StepContentContainer = styled.ScrollView`
  margin-top: -80px;
`;

const StepFieldsContainer = styled.View``;
const StepBackNavigation = styled(BackNavigation)`
  padding: 24px;
`;

const StepBanner = styled(Banner)``;

const StepExplanationWrapper = styled.View`
  margin-left: 25px;
  margin-top: 76px;
  margin-bottom: 48px;
  width: 285px;
`;

const StepExplanationTagline = styled(Text)`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 16px;
  color: ${props => props.color};
  line-height: 20px;
  letter-spacing: 0.5px;
`;
const StepExplanationHeading = styled(Heading)`
  font-size: 30px;
  line-height: 40px;
  color: ${props => props.color};
`;

const StepExplanationText = styled(Text)`
  font-size: 16px;
  margin-top: 16px;
  color: ${props => props.color};
  line-height: 25px;
`;

const StepFooter = styled(FooterAction)``;

function Step({
  theme,
  banner,
  description,
  fields,
  footer,
  onBack,
  onClose,
  onFieldChange,
  isBackBtnVisible,
}) {
  return (
    <StepContainer bg={theme.step.bg}>
      <StepBackNavigation isBackBtnVisible={isBackBtnVisible} onBack={onBack} onClose={onClose} />
      <StepContentContainer showsHorizontalScrollIndicator={false}>
        <StepBanner {...banner} />

        <StepExplanationWrapper>
          <StepExplanationTagline color={theme.step.text.colors.secondary}>
            {description.tagline}
          </StepExplanationTagline>
          <StepExplanationHeading color={theme.step.text.colors.primary}>
            {description.heading}
          </StepExplanationHeading>
          <StepExplanationText color={theme.step.text.colors.primary}>
            {description.text}
          </StepExplanationText>
        </StepExplanationWrapper>

        {/* Implement Field component to render field types */}
        {fields && <StepFieldsContainer />}

        {footer.buttons && (
          <StepFooter>
            {footer.buttons.map(button => {
              const { label, ...buttonProps } = button;
              return (
                <Button {...buttonProps}>
                  <Text>{label}</Text>
                </Button>
              );
            })}
          </StepFooter>
        )}
      </StepContentContainer>
    </StepContainer>
  );
}

Step.propTypes = {
  /**
   * The array of fields that are going to be displayed in the Step
   */
  fields: PropTypes.arrayOf({}),
  /**
   * Property for hiding the back button in the step
   */
  isBackBtnVisible: PropTypes.bool,
  /**
   * The function to handle a press on the back button
   */
  onBack: PropTypes.func,
  /**
   * The function to handle a press on the next button
   */
  onNext: PropTypes.func,
  /**
   * The function to handle a press on the close button
   */
  onClose: PropTypes.func,
  /**
   * The function to handle field input changes
   */
  onFieldChange: PropTypes.func,
  /**
   * Properties to adjust the banner at the top of a step
   */
  banner: PropTypes.shape({
    height: PropTypes.string,
    imageSrc: PropTypes.string,
    imageStyle: PropTypes.object,
  }),

  /**
   * Values for the description section of the step, including (tagline, heading and text)
   */
  description: {
    tagline: PropTypes.string,
    heading: PropTypes.string,
    text: PropTypes.string,
  },

  /**
   * Proprties for changing the footer of the step.
   */
  footer: PropTypes.shape({
    background: PropTypes.string,
    buttons: PropTypes.arrayOf(
      PropTypes.shape({
        ...Button.PropTypes,
      })
    ),
  }),

  /**
   * The theming of the component
   */
  theme: PropTypes.shape({
    step: PropTypes.shape({
      bg: PropTypes.string,
      text: PropTypes.shape({
        colors: PropTypes.shape({
          primary: PropTypes.string,
          secondary: PropTypes.string,
        }),
      }),
    }),
  }),
};

Step.defaultProps = {
  theme: {
    step: {
      bg: '#FFAA9B',
      text: {
        colors: {
          primary: '#00213f',
          secondary: '#733232',
        },
      },
    },
  },
  banner: {
    imageSrc: undefined,
    icon: undefined,
  },
  footer: {
    background: '#00213F',
  },
};
export default Step;
