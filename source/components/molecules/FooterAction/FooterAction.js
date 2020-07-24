import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Button, Text } from 'source/components/atoms';

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
  background,
  answers,
  onStart,
  onClose,
  onNext,
  onBack,
  onUpdate,
  onSubmit,
  updateCaseInContext,
  children,
}) => {
  const actionMap = type => {
    switch (type) {
      case 'start': {
        return onStart || null;
      }
      case 'close': {
        return () => {
          if (onUpdate) onUpdate(answers, 'ongoing');
          if (updateCaseInContext) updateCaseInContext(answers, 'ongoing');
          if (onClose) onClose();
        };
      }
      case 'submit': {
        return onSubmit || null;
      }
      default: {
        return () => {
          if (onUpdate) onUpdate(answers, 'ongoing');
          if (updateCaseInContext) updateCaseInContext(answers, 'ongoing');
          if (onNext) onNext();
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

  const buttons = actions.map(action => (
    <Flex>
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
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,

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
   * Current form answers, used for passing to the various actions
   */
  answers: PropTypes.object,
  /** Behaviour for the start action */
  onStart: PropTypes.func,
  /** Behaviour for the close action */
  onClose: PropTypes.func,
  /** Behaviour for the next page action */
  onNext: PropTypes.func,
  /** Behaviour for the back action */
  onBack: PropTypes.func,
  /** Behaviour for sending updates to context and/or backend */
  onUpdate: PropTypes.func,
  /** Behaviour for the submit action */
  onSubmit: PropTypes.func,
  /** Behaviour for updating case in context and backend */
  updateCaseInContext: PropTypes.func,
};

FooterAction.defaultProps = {
  background: '#00213F',
};
export default FooterAction;
