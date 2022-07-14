import React, { useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import PropTypes from "prop-types";
import styled from "styled-components/native";
import FormField from "../../../containers/FormField";
import Progressbar from "../../atoms/Progressbar/Progressbar";
import BackNavigation from "../../molecules/BackNavigation/BackNavigation";
import CloseDialog from "../../molecules/CloseDialog/CloseDialog";
import Banner from "./StepBanner/StepBanner";
import StepDescription from "./StepDescription/StepDescription";
import StepFooter from "./StepFooter/StepFooter";

import { ApplicationStatusType } from "../../../types/Case";
import type { PrimaryColor } from "../../../styles/themeHelpers";

const {
  NEW_APPLICATION,
  ACTIVE_ONGOING_NEW_APPLICATION,
  ACTIVE_ONGOING_RANDOM_CHECK,
  ACTIVE_RANDOM_CHECK_REQUIRED_VIVA,
  ACTIVE_SUBMITTED_RANDOM_CHECK_VIVA,
  ACTIVE_COMPLETION_REQUIRED_VIVA,
  ACTIVE_ONGOING_COMPLETION,
  ACTIVE_SUBMITTED_COMPLETION,
} = ApplicationStatusType;

enum DIALOG_TEMPLATE {
  MAIN_STEP = "mainStep",
  MAIN_STEP_COMPLETIONS = "mainStep:completions",
  SUB_STEP = "subStep",
  NEW_APPLICATION_STEP = "newApplication",
}

interface DialogButtons {
  text: string;
  color?: PrimaryColor;
  clickHandler: () => void;
}

interface DialogText {
  title: string;
  body: string;
}

const dialogTextCloseInThreeDays: DialogText = {
  title: "Vill du avbryta ansökan",
  body: "Ansökan sparas i 3 dagar. Efter det raderas den och du får starta en ny.",
};

const dialogTextSaveForm: DialogText = {
  title: "Vill du stänga formuläret?",
  body: "Formuläret sparas och du kan fortsätta fylla i det fram till sista dagen för inlämning.",
};

const dialogCloseWithoutSaving: DialogText = {
  title: "Vill du stänga fönster utan att spara inmatad uppgift?",
  body: "",
};

const dialogTexts: Record<DIALOG_TEMPLATE, DialogText> = {
  [DIALOG_TEMPLATE.MAIN_STEP]: dialogTextCloseInThreeDays,
  [DIALOG_TEMPLATE.NEW_APPLICATION_STEP]: dialogTextCloseInThreeDays,
  [DIALOG_TEMPLATE.MAIN_STEP_COMPLETIONS]: dialogTextSaveForm,
  [DIALOG_TEMPLATE.SUB_STEP]: dialogCloseWithoutSaving,
};

const getDialogText = (template: DIALOG_TEMPLATE): DialogText =>
  dialogTexts[template] ?? { title: "", body: "" };

const statusTemplateMap: Record<string, DIALOG_TEMPLATE> = {
  [ACTIVE_RANDOM_CHECK_REQUIRED_VIVA]: DIALOG_TEMPLATE.MAIN_STEP_COMPLETIONS,
  [ACTIVE_SUBMITTED_RANDOM_CHECK_VIVA]: DIALOG_TEMPLATE.MAIN_STEP_COMPLETIONS,
  [ACTIVE_SUBMITTED_COMPLETION]: DIALOG_TEMPLATE.MAIN_STEP_COMPLETIONS,
  [ACTIVE_ONGOING_RANDOM_CHECK]: DIALOG_TEMPLATE.MAIN_STEP_COMPLETIONS,
  [ACTIVE_COMPLETION_REQUIRED_VIVA]: DIALOG_TEMPLATE.MAIN_STEP_COMPLETIONS,
  [ACTIVE_ONGOING_COMPLETION]: DIALOG_TEMPLATE.MAIN_STEP_COMPLETIONS,
  [NEW_APPLICATION]: DIALOG_TEMPLATE.NEW_APPLICATION_STEP,
  [ACTIVE_ONGOING_NEW_APPLICATION]: DIALOG_TEMPLATE.NEW_APPLICATION_STEP,
};

const getDialogTemplate = (status: string): DIALOG_TEMPLATE =>
  statusTemplateMap[status] ?? DIALOG_TEMPLATE.MAIN_STEP;

const StepContentContainer = styled.View`
  flex: 1;
  min-height: ${Dimensions.get("window").height}px;
`;

const StepBackNavigation = styled(BackNavigation)`
  padding: 24px 24px 0px 24px;
`;

const StepLayout = styled.View`
  flex: 1;
  flex-direction: column;
`;

const StepBody = styled.View`
  flex: 1;
`;

const StepFieldListWrapper = styled.View`
  margin: 24px;
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
  onFieldChange,
  onFieldBlur,
  onFieldMount,
  onAddAnswer,
  isBackBtnVisible,
  currentPosition,
  totalStepNumber,
  answerSnapshot,
  attachments,
  isFormEditable,
  details,
  onCloseForm,
}): JSX.Element {
  const isSubstep = currentPosition.level !== 0;
  const isLastMainStep =
    currentPosition.level === 0 &&
    currentPosition.currentMainStep === totalStepNumber;
  const isDirtySubStep =
    JSON.stringify(answers) !== JSON.stringify(answerSnapshot) && isSubstep;

  const isCompletion = [
    ACTIVE_RANDOM_CHECK_REQUIRED_VIVA,
    ACTIVE_ONGOING_RANDOM_CHECK,
    ACTIVE_COMPLETION_REQUIRED_VIVA,
    ACTIVE_ONGOING_COMPLETION,
  ].includes(status.type);

  const initialDialogTemplate = getDialogTemplate(status.type);

  const [dialogIsVisible, setDialogIsVisible] = useState(false);
  const [dialogTemplate, setDialogTemplate] = useState(initialDialogTemplate);

  const closeDialogAndForm = () => {
    setDialogIsVisible(false);
    void onCloseForm();
  };

  const navigateToMainForm = () => {
    formNavigation.restoreSnapshot();
    formNavigation.goToMainForm();
  };

  const closeDialog = () => {
    setDialogIsVisible(false);
  };

  const defaultButtons: DialogButtons[] = [
    {
      text: "Nej",
      color: "neutral" as PrimaryColor,
      clickHandler: closeDialog,
    },
    {
      text: "Ja",
      clickHandler: closeDialogAndForm,
    },
  ];

  const dialogButtons: DialogButtons[] = {
    [DIALOG_TEMPLATE.MAIN_STEP_COMPLETIONS]: defaultButtons,
    [DIALOG_TEMPLATE.MAIN_STEP]: defaultButtons,
    [DIALOG_TEMPLATE.SUB_STEP]: [
      {
        text: "Nej",
        color: "neutral" as PrimaryColor,
        clickHandler: closeDialog,
      },
      {
        text: "Ja",
        clickHandler: navigateToMainForm,
      },
    ],
    [DIALOG_TEMPLATE.NEW_APPLICATION_STEP]: defaultButtons,
  }[dialogTemplate];

  const backButtonBehavior = isSubstep
    ? () => {
        if (isDirtySubStep) {
          if (dialogTemplate !== DIALOG_TEMPLATE.SUB_STEP)
            setDialogTemplate(DIALOG_TEMPLATE.SUB_STEP);
          setDialogIsVisible(true);
          return;
        }

        formNavigation.deleteSnapshot();
        formNavigation.goToMainForm();
      }
    : () => {
        const template = isCompletion
          ? DIALOG_TEMPLATE.MAIN_STEP_COMPLETIONS
          : DIALOG_TEMPLATE.MAIN_STEP;

        if (dialogTemplate === DIALOG_TEMPLATE.SUB_STEP)
          setDialogTemplate(template);
        formNavigation.back();
      };

  const showCloseFormButton = !actions.some(
    ({ type = "" }) => type === "close"
  );
  const dialogText = getDialogText(dialogTemplate);

  const avoidingBehavior = Platform.OS === "ios" ? "position" : "padding";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={avoidingBehavior}
      keyboardVerticalOffset={-100}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StepContentContainer>
          {banner &&
            banner.constructor === Object &&
            Object.keys(banner).length > 0 && (
              <Banner {...banner} colorSchema={colorSchema || "blue"} />
            )}
          {currentPosition.level === 0 && (
            <Progressbar
              currentStep={currentPosition.currentMainStep}
              totalStepNumber={totalStepNumber}
            />
          )}
          <StepLayout>
            <StepBody>
              <StepDescription
                theme={theme}
                currentStep={
                  currentPosition.level === 0
                    ? currentPosition.currentMainStep
                    : undefined
                }
                totalStepNumber={totalStepNumber}
                colorSchema={colorSchema || "blue"}
                {...description}
              />
              {questions && (
                <StepFieldListWrapper>
                  {questions.map((field) => (
                    <FormField
                      key={`${field.id}`}
                      onChange={onFieldChange}
                      onBlur={onFieldBlur}
                      onMount={onFieldMount}
                      inputType={field.type}
                      value={answers[field.id] || ""}
                      validationErrors={validation}
                      colorSchema={
                        field.color && field.color !== ""
                          ? field.color
                          : colorSchema
                      }
                      id={field.id}
                      formNavigation={formNavigation}
                      editable={!field.disabled && isFormEditable}
                      onAddAnswer={onAddAnswer}
                      details={details}
                      {...field}
                      answers={answers}
                    />
                  ))}
                </StepFieldListWrapper>
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
                validateStepAnswers={validateStepAnswers}
                attachments={attachments}
              />
            ) : null}
          </StepLayout>
        </StepContentContainer>
      </ScrollView>

      <CloseDialog
        visible={dialogIsVisible}
        title={dialogText.title}
        body={dialogText.body}
        buttons={dialogButtons}
      />

      <StepBackNavigation
        showBackButton={isBackBtnVisible && isFormEditable}
        showCloseButton={showCloseFormButton}
        primary={!isSubstep}
        isSubstep={isSubstep}
        onBack={backButtonBehavior}
        onClose={() => {
          if (isLastMainStep) {
            void onCloseForm();
          } else {
            setDialogIsVisible(true);
          }
        }}
        colorSchema={colorSchema || "blue"}
      />
    </KeyboardAvoidingView>
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
  colorSchema: PropTypes.oneOf(["blue", "green", "red", "purple", "neutral"]),
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

  onFieldMount: PropTypes.func,

  /** The function to handle when a repeater field gets an answer added */

  onAddAnswer: PropTypes.func,

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
  attachments: PropTypes.array,
  isFormEditable: PropTypes.bool,
};

Step.defaultProps = {
  theme: {
    step: {
      bg: "#FFAA9B",
      text: {
        colors: {
          primary: "#00213F",
          secondary: "#733232",
        },
      },
    },
  },
  banner: {
    imageSrc: undefined,
    icon: undefined,
  },
  footerBg: "#00213F",
};
export default Step;
