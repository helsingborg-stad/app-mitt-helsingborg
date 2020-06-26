import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Checkbox, Text } from 'source/components/atoms';
import colors from '../../../styles/colors';

const FlexContainer = styled.View`
  flex: auto;
  flex-direction: row;
  align-items: center;
  margin: 8px;
  margin-bottom: 8px;
`;

const sizes = {
  small: {
    padding: 0.5,
    margin: 4,
    fontSize: 14,
  },
  medium: {
    padding: 0.5,
    margin: 4,
    fontSize: 18,
  },
  large: {
    padding: 0.5,
    margin: 4,
    fontSize: 20,
  },
};

const CheckboxField = props => {
  const { text, color, size, ...other } = props;
  const textStyle = {
    color: colors.checkboxField[color].text,
    ...sizes[size],
  };
  return (
    <FlexContainer>
      <Checkbox color={color} size={size} {...other} />
      <Text style={textStyle}>{text}</Text>
    </FlexContainer>
  );
};

CheckboxField.propTypes = {
  /**
   * The text to show at the side of the checkbox.
   */
  text: PropTypes.string,
  /**
   * Boolean that determines if the checkbox is checked or not. Manages the 'state' of the component.
   */
  checked: PropTypes.bool.isRequired,
  /**
   * What happens when the checkbox is clicked. Should switch the checked prop.
   */
  onChange: PropTypes.func,
  /**
   * sets the color theme.
   */
  color: PropTypes.oneOf(Object.keys(colors.checkboxField)),
  /**
   * One of small, medium, large
   */
  size: PropTypes.oneOf(Object.keys(sizes)),
  /**
   * Disables the checkbox if true.
   */
  disabled: PropTypes.bool,
};

CheckboxField.defaultProps = {
  onChange: () => {},
  color: 'light',
  size: 'small',
  disabled: false,
};

export default CheckboxField;
