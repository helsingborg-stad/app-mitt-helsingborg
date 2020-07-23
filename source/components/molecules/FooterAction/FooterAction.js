import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Button, Text } from 'source/components/atoms';
// justifyContent: 'space-around',
// bottom: 0,
// padding: 30,
// display: 'flex',
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
          if (onClose) onClose();
        };
      }
      case 'submit': {
        return onSubmit || null;
      }
      default: {
        return () => {
          if (onUpdate) onUpdate(answers, 'ongoing');
          if (onNext) onNext();
        };
      }
    }
  };

  const buttons = actions.map(action => (
    <Flex>
      <Button onClick={actionMap(action.type)} color={action.color}>
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
    })
  ),
  /**
   * Background color for the footer
   */
  background: PropTypes.string,
  answers: PropTypes.object,
  onStart: PropTypes.func,
  onClose: PropTypes.func,
  onNext: PropTypes.func,
  onBack: PropTypes.func,
  onUpdate: PropTypes.func,
  onSubmit: PropTypes.func,
};

FooterAction.defaultProps = {
  background: '#00213F',
};
export default FooterAction;
