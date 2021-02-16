import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Button, Icon, Text } from '../../atoms';
import Box from '../../atoms/Box/Box';

const ButtonFieldWrapper = styled(Box).attrs({
  m: '2px',
})`
  flex: 1;
`;

export type NavigationActionType =
  | { type: 'navigateDown'; stepId: string }
  | { type: 'navigateUp' }
  | { type: 'navigateNext' }
  | { type: 'navigateBack' };

export interface Props {
  iconName?: string;
  text?: string;
  colorSchema?: string;
  navigationType: NavigationActionType;
  formNavigation: {
    next: () => void;
    back: () => void;
    down: (targetStepId: string) => void;
    up: () => void;
    createSnapshot: () => void;
  };
}

// TODO: Move navigation logic to a smart container component,
// this dumb component do not need to know about how formNavigation is handled.
// Only that an onClick event should be triggered.
const NavigationButtonField: React.FC<Props> = ({
  iconName,
  text,
  navigationType,
  formNavigation,
  colorSchema,
}) => {
  const onClick = () => {
    // This logic could be broken out and placed elsewhere.
    switch (navigationType.type) {
      case 'navigateDown':
        formNavigation.createSnapshot();
        formNavigation.down(navigationType.stepId);
        break;
      case 'navigateUp':
        formNavigation.up();
        break;
      case 'navigateNext':
        formNavigation.next();
        break;
      case 'navigateBack':
        formNavigation.back();
        break;

      default:
        break;
    }
  };

  return (
    <ButtonFieldWrapper>
      <Button variant="outlined" onClick={onClick} colorSchema={colorSchema}>
        {iconName.length ? <Icon name={iconName} /> : null}
        {text && <Text>{text}</Text>}
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
   * Color schema of the button
   */
  colorSchema: PropTypes.oneOf(['blue', 'red', 'purple', 'green']),
  /**
   * Object with navigation event for a form.
   */
  formNavigation: PropTypes.any,
};

NavigationButtonField.defaultProps = {
  iconName: 'add',
  text: '',
  colorSchema: 'blue',
};

export default NavigationButtonField;
