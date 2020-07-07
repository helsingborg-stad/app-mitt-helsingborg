import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Text, Button } from '../../atoms';
import { BackNavigation, Banner, FooterAction, StepDescription, FormField } from '../../molecules';
import FieldList from '../FieldList/FieldList';

const StepContainer = styled.View`
  background: ${props => props.bg};
  flex: 1;
`;

const StepContentContainer = styled.ScrollView`
  /* Covers space occupied by the StepBackNavigation */
  margin-top: -80px;
  height: 100%;
  position: relative;
`;

const StepBackNavigation = styled(BackNavigation)`
  padding: 24px;
`;

const StepBanner = styled(Banner)`
  flex: 1;
`;

const StepBody = styled.View``;
const StepFieldListWrapper = styled.View`
  margin: 24px;
`;
// margin: auto;

const StepFooter = styled(FooterAction)`
  position: absolute;
  bottom: 0;
`;

function Step({
  theme,
  banner,
  description,
  fields,
  footer,
  answers,
  onBack,
  onClose,
  onFieldChange,
  isBackBtnVisible,
}) {
  return (
    <StepContainer bg={theme.step.bg}>
      <StepBackNavigation isBackBtnVisible={isBackBtnVisible} onBack={onBack} onClose={onClose} />
      <StepContentContainer
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsHorizontalScrollIndicator={false}
      >
        <StepBanner {...banner} />
        <StepBody>
          <StepDescription theme={theme} {...description} />
          {fields && (
            <StepFieldListWrapper>
              {fields.map(field => (
                <FormField
                  label={field.label}
                  onChange={onFieldChange}
                  placeholder={field.placeholder}
                  id={field.id}
                  inputType={field.type}
                  value={answers[field.id] || ''}
                />
              ))}
            </StepFieldListWrapper>
          )}
        </StepBody>
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
   * The answers of a form.
   */
  answers: PropTypes.arrayOf({}),
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
          primary: '#00213F',
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
