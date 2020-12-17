import React, { useContext, useEffect } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import AuthContext from '../../../../store/AuthContext';
import { Button, Text } from '../../../atoms';
import { Action, ActionType, Question } from '../../../../types/FormTypes';
import { CaseStatus } from '../../../../types/CaseType';
import { FormPosition } from '../../../../containers/Form/hooks/useForm';
import { useNotification } from '../../../../store/NotificationContext';
import { evaluateConditionalExpression } from '../../../../helpers/conditionParser';

const ActionContainer = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.neutrals[5]};
`;

const Flex = styled.View`
  padding: 5px;
  align-items: flex-end;
`;

const ButtonWrapper = styled.View`
  margin-top: 32px;
  margin-bottom: 49px;
  margin-right: 32px;
`;

interface Props {
  actions: Action[];
  caseStatus: CaseStatus;
  background?: string;
  answers: Record<string, any>;
  allQuestions: Question[];
  formNavigation: {
    next: () => void;
    back: () => void;
    up: (targetStep: number | string) => void;
    down: (targetStep: number | string) => void;
    start: (callback: () => void) => void;
    close: () => void;
    goToMainForm: () => void;
    goToMainFormAndNext: () => void;
    isLastStep: () => boolean;
  };
  onUpdate: (answers: Record<string, any>) => void;
  onSubmit: () => void;
  updateCaseInContext: (
    answers: Record<string, any>,
    status: CaseStatus,
    currentPosition: FormPosition
  ) => void;
  currentPosition: FormPosition;
  validateStepAnswers: (errorCallback: () => void, onValidCallback: () => void) => void;
}

const StepFooter: React.FC<Props> = ({
  actions,
  caseStatus,
  answers,
  allQuestions,
  formNavigation,
  onUpdate,
  onSubmit,
  updateCaseInContext,
  currentPosition,
  children,
  validateStepAnswers,
}) => {
  const { user, handleSign, status, isLoading } = useContext(AuthContext);
  const showNotification = useNotification();

  useEffect(() => {
    const signCase = () => {
      if (onUpdate) onUpdate(answers);
      if (updateCaseInContext) updateCaseInContext(answers, 'submitted', currentPosition);
      if (formNavigation.next) formNavigation.next();
    };

    if (status === 'signResolved') {
      signCase();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const actionMap = (type: ActionType) => {
    switch (type) {
      case 'start': {
        return formNavigation.start || null;
      }
      case 'close': {
        return () => {
          if (onUpdate && caseStatus === 'ongoing') onUpdate(answers);
          if (formNavigation.close) formNavigation.close();
        };
      }
      case 'submit': {
        return onSubmit || null;
      }
      case 'sign': {
        return async () => {
          await handleSign(user.personalNumber, 'Signering för Mitt Helsingborg');
        };
      }
      case 'backToMain': {
        return formNavigation.goToMainForm;
      }
      case 'backToMainAndNext': {
        return formNavigation.goToMainFormAndNext;
      }
      default: {
        return () => {
          const errorCallback = () => {
            showNotification(
              'Oj, fel inmatning!',
              'Vänligen rätta fel innan ni går vidare',
              'error',
              8000
            );
          };
          const onValidCallback = () => {
            if (formNavigation.next) formNavigation.next();
          };

          if (onUpdate && caseStatus === 'ongoing') onUpdate(answers);
          if (updateCaseInContext && caseStatus === 'ongoing')
            updateCaseInContext(answers, 'ongoing', currentPosition);

          validateStepAnswers(errorCallback, onValidCallback);
        };
      }
    }
  };

  const checkCondition = (condition?: string) => {
    if (!condition || condition === '') return false;
    return !evaluateConditionalExpression(condition, answers, allQuestions);
  };

  const buttons = actions.map((action, index) => (
    <Flex key={`${index}-${action.label}`}>
      <Button
        onClick={actionMap(action.type)}
        colorSchema={action.color}
        disabled={isLoading || (action.hasCondition && checkCondition(action.conditionalOn))}
        z={0}
      >
        <Text>{action.label}</Text>
      </Button>
    </Flex>
  ));

  return (
    <ActionContainer>
      <ButtonWrapper>
        {buttons}
        {children}
      </ButtonWrapper>
    </ActionContainer>
  );
};

StepFooter.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),

  /**
   * Properties for actions in the footer of the step.
   */
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string,
      conditionalOn: PropTypes.string,
    })
  ).isRequired,
  /**
   * Background color for the footer
   */
  background: PropTypes.string,
  /**
   * Status: ongoing or submitted or possibly others
   */
  caseStatus: PropTypes.string,
  /**
   * Current form answers, used for passing to the various actions
   */
  answers: PropTypes.object,
  allQuestions: PropTypes.array,
  /**
   * An object bundling all functions relevant for navigation through the form.
   */
  formNavigation: PropTypes.shape({
    /** go to next step */
    next: PropTypes.func,
    /** go to previous step */
    back: PropTypes.func,
    /** go up a level to parent step */
    up: PropTypes.func,
    /** go down to a child step */
    down: PropTypes.func,
    /** close the form */
    close: PropTypes.func,
    /** action to trigger when starting the form */
    start: PropTypes.func,
    /** action to return to main form */
    goToMainForm: PropTypes.func,
    goToMainFormAndNext: PropTypes.func,
    /** whether we are at the last of the main steps */
    isLastStep: PropTypes.func,
  }).isRequired,
  onUpdate: PropTypes.func,
  /** Behaviour for the submit action */
  onSubmit: PropTypes.func,
  /** Behaviour for updating case in context and backend */
  updateCaseInContext: PropTypes.func,
  /** The current position in the form */
  currentPosition: PropTypes.shape({
    index: PropTypes.number,
    level: PropTypes.number,
    currentMainStep: PropTypes.number,
    currentMainStepIndex: PropTypes.number,
  }).isRequired,
  /** Validate all answers in current step * */
  validateStepAnswers: PropTypes.func,
};

StepFooter.defaultProps = {
  background: '#00213F',
};
export default StepFooter;
