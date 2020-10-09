import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Button, Icon, Text } from '../../atoms';
import colors from '../../../styles/colors';

const ButtonFieldWrapper = styled.View`
  flex: 1;
  margin: 2px;
`;

export type ActionType =
  | { type: 'navigateDown'; stepId: string }
  | { type: 'navigateUp' }
  | { type: 'navigateNext' }
  | { type: 'navigateBack' };

export interface Props {
  iconName: string;
  text: string;
  color: string;
  navigationType: ActionType;
  formNavigation: {
    next: () => void;
    back: () => void;
    down: (targetStepId: string) => void;
    up: () => void;
  };
}

const NavigationButtonField: React.FC<Props> = ({
  iconName,
  text,
  color,
  navigationType,
  formNavigation,
}) => {
  let onClick = (targetId?: string) => {};
  switch (navigationType.type) {
    case 'navigateDown':
      onClick = () => formNavigation.down(navigationType.stepId);
      break;
    case 'navigateUp':
      onClick = () => formNavigation.up();
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
NavigationButtonField.propTypes = {
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
  navigationType: PropTypes.any,
  /**
   * Color of the button
   */
  color: PropTypes.oneOf(Object.keys(colors.button)),
  formNavigation: PropTypes.any,
};

NavigationButtonField.defaultProps = {
  iconName: '',
  text: '',
  color: 'white',
};

export default NavigationButtonField;
