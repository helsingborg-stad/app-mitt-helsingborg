import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Button, Icon, Text } from '../../atoms';
import colors from '../../../styles/colors';

const ButtonFieldWrapper = styled.View`
  flex: 1;
  margin: 24px;
`;

const ButtonField = ({ iconName, text, onClick, color }) => (
  <ButtonFieldWrapper>
    <Button onClick={onClick} color={color} block>
      <Text>{text}</Text>
      {iconName.length ? <Icon name={iconName} /> : null}
    </Button>
  </ButtonFieldWrapper>
);

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
  onClick: PropTypes.func,
  /**
   * Color of the button
   */
  color: PropTypes.oneOf(Object.keys(colors.button)),
};

ButtonField.defaultProps = {
  iconName: '',
  text: '',
  color: 'white',
  onClick: () => {},
};

export default ButtonField;
