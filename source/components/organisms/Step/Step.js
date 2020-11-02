import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import AuthContext from 'app/store/AuthContext';
import { Text } from 'react-native';
import { AuthLoading, FormField } from 'app/components/molecules';
import BackNavigation from '../../molecules/BackNavigation/BackNavigation';
import Banner from './StepBanner/StepBanner';
import FooterAction from './FooterAction/FooterAction';
import StepDescription from './StepDescription/StepDescription';

const StepContainer = styled.View`
  background: ${props => props.theme.colors.neutrals[7]};
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

const StepFooter = styled(FooterAction)`
  background: ${props => props.theme.colors.neutrals[6]}
  position: absolute;
  bottom: 0;
`;

const SignStepWrapper = styled.View`
  padding: 48px 24px 24px 24px;
`;

function Step({
  theme,
  banner,
  footerBg,
  description,
  questions,
  actions,
  answers,
  validation,
  status,
  formNavigation,
  onSubmit,
  onFieldChange,
  isBackBtnVisible,
  updateCaseInContext,
  currentPosition,
  totalStepNumber,
}) {
  const {
    isLoading,
    isRejected,
    isResolved,
    isIdle,
    error,
    handleCancelOrder,
    isBankidInstalled,
    handleSetStatus,
  } = useContext(AuthContext);

  /**
   * Set auth context status to idle when navigating
   */
  useEffect(() => {
    handleSetStatus('idle');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPosition]);

  /** TODO: move out of this scope, this logic should be defined on the form component */
  const closeForm = () => {
    if (status === 'ongoing') {
      if (onFieldChange) onFieldChange(answers);
      if (updateCaseInContext)
        updateCaseInContext(answers, 'ongoing', currentPosition.currentMainStep);
    }
    if (formNavigation?.close) formNavigation.close(() => {});
  };

  return (
    <StepContainer>
      <StepBackNavigation
        showBackButton={isBackBtnVisible}
        onBack={formNavigation?.back ? formNavigation.back : undefined}
        onClose={closeForm}
      />
      <StepContentContainer
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsHorizontalScrollIndicator={false}
      >
        {banner && banner.constructor === Object && Object.keys(banner).length > 0 && (
          <StepBanner
            currentPosition={currentPosition}
            totalStepNumber={totalStepNumber}
            {...banner}
          />
        )}
        <StepBody>
          {(isResolved || isIdle) && (
            <>
              <StepDescription theme={theme} {...description} />
              {questions && (
                <StepFieldListWrapper>
                  {questions.map(field => (
                    <FormField
                      key={`${field.id}`}
                      onChange={status === 'ongoing' ? onFieldChange : null}
                      inputType={field.type}
                      value={answers[field.id] || ''}
                      answers={answers}
                      error={validation[field.id]}
                      color={field.color}
                      id={field.id}
                      formNavigation={formNavigation}
                      {...field}
                    />
                  ))}
                </StepFieldListWrapper>
              )}
            </>
          )}

          {isLoading && (
            <SignStepWrapper>
              <AuthLoading
                cancelSignIn={() => handleCancelOrder()}
                isBankidInstalled={isBankidInstalled}
              />
            </SignStepWrapper>
          )}

          {/* TODO: Fix how to display error messages */}
          {isRejected && (
            <SignStepWrapper>
              <Text>{error && error.message}</Text>
            </SignStepWrapper>
          )}
        </StepBody>
        {actions && actions.length > 0 ? (
          <StepFooter
            actions={actions}
            caseStatus={status}
            background={footerBg}
            answers={answers}
            formNavigation={formNavigation}
            currentPosition={currentPosition}
            onUpdate={onFieldChange}
            updateCaseInContext={updateCaseInContext}
          />
        ) : null}
      </StepContentContainer>
    </StepContainer>
  );
}

Step.propTypes = {
  /**
   * The array of fields that are going to be displayed in the Step
   */
  questions: PropTypes.arrayOf(PropTypes.object),
  /**
   * The answers of a form.
   */
  answers: PropTypes.object,
  /**
   * User input validation result.
   */
  validation: PropTypes.object,
  /**
   * The answers of a form.
   */
  status: PropTypes.string,
  /**
   * Property for hiding the back button in the step
   */
  isBackBtnVisible: PropTypes.bool,
  /**
   * The function to handle a press on the submit button
   */
  onSubmit: PropTypes.func,
  /**
   * The function to handle field input changes
   */
  onFieldChange: PropTypes.func,
  /*
   * A object with form navigation actions
   */
  formNavigation: PropTypes.shape({
    next: PropTypes.func,
    back: PropTypes.func,
    up: PropTypes.func,
    down: PropTypes.func,
    close: PropTypes.func,
    start: PropTypes.func,
    isLastStep: PropTypes.func,
  }),
  /**
   * The function to update values in context (and thus the backend)
   */
  updateCaseInContext: PropTypes.func,
  /**
   * Properties to adjust the banner at the top of a step
   */
  banner: PropTypes.shape({
    height: PropTypes.string,
    imageSrc: PropTypes.string,
    imageStyle: PropTypes.object,
    backgroundColor: PropTypes.string,
  }),
  /**
   * Values for the description section of the step, including (tagline, heading and text)
   */
  description: PropTypes.shape({
    tagline: PropTypes.string,
    heading: PropTypes.string,
    text: PropTypes.string,
  }),

  /**
   * Properties for actions in the footer of the step.
   */
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      label: PropTypes.string,
      color: PropTypes.string,
      conditionalOn: PropTypes.string,
    })
  ),
  /** Background color for the footer */
  footerBg: PropTypes.string,
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
  /** The current position in the form */
  currentPosition: PropTypes.shape({
    index: PropTypes.number,
    level: PropTypes.number,
    currentMainStep: PropTypes.number,
  }),
  /** Total number of steps in the form */
  totalStepNumber: PropTypes.number,
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
  footerBg: '#00213F',
};
export default Step;
