import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Button, Icon, Text } from '../../atoms';
import colors from '../../../styles/colors';

const ButtonFieldWrapper = styled.View`
  flex: 1;
  margin: 24px;
`;

type ActionType =
  | { type: 'navigateDown'; stepId: string }
  | { type: 'navigateUp'; stepId: string }
  | { type: 'navigateNext' }
  | { type: 'navigateBack' };

interface Props {
  iconName: string;
  text: string;
  color: string;
  type: ActionType;
  formNavigation: {
    next: () => void;
    back: () => void;
    down: (targetStepId: string) => void;
    up: (targetStepId: string) => void;
  };
}

const ButtonField: React.FC<Props> = ({ iconName, text, color, type, formNavigation }) => {
  let onClick = (targetId?: string) => {};
  switch (type.type) {
    case 'navigateDown':
      onClick = () => formNavigation.down(type.stepId);
      break;
    case 'navigateUp':
      onClick = () => formNavigation.up(type.stepId);
      break;
    case 'navigateNext':
      onClick = formNavigation.next;
      break;
    case 'navigateBack':
      onClick = formNavigation.back;
      break;

    default:
  }
  return (
    <ButtonFieldWrapper>
      <Button onClick={onClick} color={color} block>
        <Text>{text}</Text>
        {iconName.length ? <Icon name={iconName} /> : null}
      </Button>
    </ButtonFieldWrapper>
  );
};
ButtonField.propTypes = {
  /**
   * Name of the icon to be displayed
   */
  iconName: PropTypes.string,
  /**
   * Text string for button
   */
  text: PropTypes.string,
  /**
   * Function is triggered when button is clicked
   */
  type: PropTypes.any,
  /**
   * Color of the button
   */
  color: PropTypes.oneOf(Object.keys(colors.button)),
  formNavigation: PropTypes.any,
};

ButtonField.defaultProps = {
  iconName: '',
  text: '',
  color: 'white',
};

export default ButtonField;
