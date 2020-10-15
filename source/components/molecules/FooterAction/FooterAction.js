import React, { useContext, useEffect } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Button, Text } from 'source/components/atoms';
import AuthContext from 'app/store/AuthContext';

const ActionContainer = styled.View(props => ({
  flex: 1,
  backgroundColor: props.background,
}));
const Flex = styled.View`
  padding: 5px;
  align-items: flex-end;
  padding-right: 10px;
`;
const ButtonWrapper = styled.View`
  margin-top: 5%;
  margin-bottom: 5%;
`;

const FooterAction = ({
  actions,
  caseStatus,
  background,
  answers,
  formNavigation,
  onUpdate,
  onSubmit,
  updateCaseInContext,
  stepNumber,
  children,
}) => {
  const { user, handleSign, status } = useContext(AuthContext);

  useEffect(() => {
    const signCase = () => {
      if (onUpdate) onUpdate(answers);
      if (updateCaseInContext) updateCaseInContext(answers, 'submitted', stepNumber);
      if (formNavigation.next) formNavigation.next();
    };

    if (status === 'signResolved') {
      signCase();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const actionMap = type => {
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
      default: {
        return () => {
          if (onUpdate && caseStatus === 'ongoing') onUpdate(answers);
          if (updateCaseInContext && caseStatus === 'ongoing')
            updateCaseInContext(answers, 'ongoing', stepNumber);
          if (formNavigation.next) formNavigation.next();
        };
      }
    }
  };

  const checkCondition = questionId => {
    if (!questionId) return false;

    if (typeof questionId === 'string') {
      if (questionId[0] === '!') {
        const qId = questionId.slice(1);
        return answers[qId];
      }
      return !answers[questionId];
    }
    return false;
  };

  const buttons = actions.map((action, index) => (
    <Flex key={`${index}-${action.label}`}>
      <Button
        onClick={actionMap(action.type)}
        color={action.color}
        disabled={checkCondition(action.conditionalOn)}
      >
        <Text>{action.label}</Text>
      </Button>
    </Flex>
  ));

  return (
    <ActionContainer background={background}>
      <ButtonWrapper>
        {buttons}
        {children}
      </ButtonWrapper>
    </ActionContainer>
  );
};

FooterAction.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),

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
    /** whether we are at the last of the main steps */
    isLastStep: PropTypes.func,
  }),
  onUpdate: PropTypes.func,
  /** Behaviour for the submit action */
  onSubmit: PropTypes.func,
  /** Behaviour for updating case in context and backend */
  updateCaseInContext: PropTypes.func,
  /** The steps position in the form */
  stepNumber: PropTypes.number,
};

FooterAction.defaultProps = {
  background: '#00213F',
};
export default FooterAction;
