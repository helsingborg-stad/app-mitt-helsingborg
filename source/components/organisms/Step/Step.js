import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormField from '../../../containers/FormField';
import AuthContext from '../../../store/AuthContext';
import Progressbar from '../../atoms/Progressbar/Progressbar';
import { AuthLoading } from '../../molecules';
import BackNavigation from '../../molecules/BackNavigation/BackNavigation';
import Banner from './StepBanner/StepBanner';
import StepDescription from './StepDescription/StepDescription';
import StepFooter from './StepFooter/StepFooter';
import { getStatusByType } from '../../../assets/mock/caseStatuses';
import FormDialog from './CloseDialog/FormDialog';
import { useNotification } from '../../../store/NotificationContext';

const StepContainer = styled.View`
  background: ${(props) => props.theme.colors.neutrals[7]};
  flex: 1;
`;

const StepContentContainer = styled.View``;

const StepBackNavigation = styled(BackNavigation)`
  padding: 24px;
  position: absolute;
`;

const StepBanner = styled(Banner)`
  flex: 1;
`;

const StepBody = styled.View``;
const StepFieldListWrapper = styled.View`
  margin: 24px;
`;

const SignStepWrapper = styled.View`
  padding: 48px 24px 24px 24px;
`;

function Step({
  theme,
  colorSchema,
  banner,
  description,
  questions,
  actions,
  answers,
  allQuestions,
  validation,
  validateStepAnswers,
  status,
  formNavigation,
  onSubmit,
  onFieldChange,
  onFieldBlur,
  isBackBtnVisible,
  updateCaseInContext,
  currentPosition,
  totalStepNumber,
  answerSnapshot,
}) {
  const {
    isLoading,
    isResolved,
    isRejected,
    error,
    handleCancelOrder,
    isBankidInstalled,
    handleSetStatus,
    handleSetError,
  } = useContext(AuthContext);

  const showNotification = useNotification();

  /**
   * Set auth context status to idle when navigating
   */
  useEffect(() => {
    handleSetStatus('idle');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPosition]);

  /**
   * Effect for showing notification if an error occurs
   */
  useEffect(() => {
    if (isRejected && error?.message) {
      showNotification(error.message, '', 'neutral');
      handleSetError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  /** TODO: move out of this scope, this logic should be defined on the form component */
  const closeForm = () => {
    if (status.type.includes('ongoing') || status.type.includes('notStarted')) {
      if (onFieldChange) {
        onFieldChange(answers);
      }
      if (updateCaseInContext) {
        updateCaseInContext(answers, getStatusByType('active:ongoing'), currentPosition);
      }
    }
    if (formNavigation?.close) {
      formNavigation.close(() => {});
    }
  };

  const isSubstep = currentPosition.level !== 0;
  const isLastMainStep =
    currentPosition.level === 0 && currentPosition.currentMainStep === totalStepNumber;

  const [fadeValue] = useState(new Animated.Value(0));

  const isDirtySubStep = JSON.stringify(answers) !== JSON.stringify(answerSnapshot) && isSubstep;

  const [dialogIsVisible, setDialogIsVisible] = useState(false);
  const [dialogTemplate, setDialogTemplate] = useState('mainStep');
  const dialogButtonProps = {
    mainStep: [
      {
        text: 'Nej',
        color: 'neutral',
        clickHandler: () => setDialogIsVisible(false),
      },
      {
        text: 'Ja',
        clickHandler: () => {
          setDialogIsVisible(false);
          closeForm();
        },
      },
    ],
    subStep: [
      {
        text: 'Nej',
        color: 'neutral',
        clickHandler: () => setDialogIsVisible(false),
      },
      {
        text: 'Ja',
        clickHandler: () => {
          formNavigation.restoreSnapshot();
          formNavigation.goToMainForm();
        },
      },
    ],
  };

  useEffect(() => {
    const fadeIn = () => {
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        isInteraction: false,
      }).start();
    };
    fadeIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const backButtonBehavior = isSubstep
    ? () => {
        if (isDirtySubStep) {
          if (dialogTemplate !== 'subStep') setDialogTemplate('subStep');
          setDialogIsVisible(true);
          return;
        }

        formNavigation.deleteSnapshot();
        formNavigation.goToMainForm();
      }
    : () => {
        if (dialogTemplate !== 'mainStep') setDialogTemplate('mainStep');
        formNavigation.back();
      };

  return (
    <StepContainer>
      <KeyboardAwareScrollView>
        <Animated.View
          style={{
            opacity: fadeValue,
          }}
        >
          <FormDialog
            visible={dialogIsVisible}
            template={dialogTemplate}
            buttons={dialogButtonProps[dialogTemplate]}
          />

          {!isSubstep && (
            <StepBackNavigation
              showBackButton={isBackBtnVisible}
              isSubstep={isSubstep}
              onBack={backButtonBehavior}
              onClose={() => {
                if (isLastMainStep) {
                  closeForm();
                } else {
                  setDialogIsVisible(true);
                }
              }}
              colorSchema={colorSchema || 'blue'}
            />
          )}

          <StepContentContainer>
            {banner && banner.constructor === Object && Object.keys(banner).length > 0 && (
              <StepBanner {...banner} colorSchema={colorSchema || 'blue'} />
            )}
            {currentPosition.level === 0 && (
              <Progressbar
                currentStep={currentPosition.currentMainStep}
                totalStepNumber={totalStepNumber}
              />
            )}
            <StepBody>
              {!isLoading && (
                <>
                  <StepDescription
                    theme={theme}
                    currentStep={
                      currentPosition.level === 0 ? currentPosition.currentMainStep : undefined
                    }
                    totalStepNumber={totalStepNumber}
                    colorSchema={colorSchema || 'blue'}
                    {...description}
                  />
                  {questions && (
                    <StepFieldListWrapper>
                      {questions.map((field) => (
                        <FormField
                          key={`${field.id}`}
                          onChange={
                            status.type.includes('ongoing') || status.type.includes('notStarted')
                              ? onFieldChange
                              : null
                          }
                          onBlur={onFieldBlur}
                          inputType={field.type}
                          value={answers[field.id] || ''}
                          answers={answers}
                          validationErrors={validation}
                          colorSchema={
                            field.color && field.color !== '' ? field.color : colorSchema
                          }
                          id={field.id}
                          formNavigation={formNavigation}
                          {...field}
                        />
                      ))}
                    </StepFieldListWrapper>
                  )}
                </>
              )}

              {(isLoading || isResolved) && (
                <SignStepWrapper>
                  <AuthLoading
                    colorSchema={colorSchema || 'neutral'}
                    isLoading={isLoading}
                    isResolved={isResolved}
                    cancelSignIn={() => handleCancelOrder()}
                    isBankidInstalled={isBankidInstalled}
                  />
                </SignStepWrapper>
              )}
            </StepBody>
            {actions && actions.length > 0 ? (
              <StepFooter
                actions={actions}
                caseStatus={status}
                answers={answers}
                allQuestions={allQuestions}
                formNavigation={formNavigation}
                currentPosition={currentPosition}
                onUpdate={onFieldChange}
                updateCaseInContext={updateCaseInContext}
                validateStepAnswers={validateStepAnswers}
              />
            ) : null}
          </StepContentContainer>
        </Animated.View>
      </KeyboardAwareScrollView>

      {isSubstep && (
        <StepBackNavigation
          showBackButton={isBackBtnVisible}
          isSubstep={isSubstep}
          primary={false}
          onBack={backButtonBehavior}
          onClose={() => setDialogIsVisible(true)}
          colorSchema={colorSchema || 'blue'}
        />
      )}
    </StepContainer>
  );
}

Step.propTypes = {
  /**
   * The array of fields that are going to be displayed in the Step
   */
  questions: PropTypes.arrayOf(PropTypes.object),
  allQuestions: PropTypes.array,
  /**
   * The answers of a form.
   */
  answers: PropTypes.object,
  answerSnapshot: PropTypes.object,
  isDirtySubStep: PropTypes.bool,
  colorSchema: PropTypes.oneOf(['blue', 'green', 'red', 'purple', 'neutral']),
  /**
   * User input validation result.
   */
  validation: PropTypes.object,
  /**
   * Function that runs validation for all inputs in a step.
   */
  validateStepAnswers: PropTypes.func,
  /**
   * The answers of a form.
   */
  status: PropTypes.object,
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
  /** The function to handle fields losing focus */
  onFieldBlur: PropTypes.func,
  /*
   * A object with form navigation actions
   */
  formNavigation: PropTypes.shape({
    next: PropTypes.func,
    back: PropTypes.func,
    up: PropTypes.func,
    down: PropTypes.func,
    close: PropTypes.func,
    goToMainForm: PropTypes.func,
    start: PropTypes.func,
    isLastStep: PropTypes.func,
    restoreSnapshot: PropTypes.func,
    deleteSnapshot: PropTypes.func,
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
