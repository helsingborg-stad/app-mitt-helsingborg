import React from 'react';
import { TextInput } from 'react-native';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/native';
import colors from '../../../styles/colors';

const input = css`
  width: 100%;
  background-color: ${({ color }) => colors.input[color].background};
  border-radius: 17.5px;
  border: solid 1px
    ${({ color, error }) =>
      error?.isValid || error === undefined ? colors.input[color].border : colors.input.red.border};
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
  margin: 3px;
  color: ${({ color }) => colors.input[color].text};
  ${props => (props.center ? 'text-align: center;' : null)}
`;

const inputText = styled(TextInput)`
  ${input}
`;

const Input = props => {
  const { color } = props;
  return React.createElement(inputText, {
    placeholderTextColor: colors.input[color].placeholder,
    ...props,
  });
};

Input.propTypes = {
  /**
   * Sets the color theme, default is light.
   */
  color: PropTypes.oneOf(Object.keys(colors.input)),
};

Input.defaultProps = {
  color: 'light',
};

export default Input;
export { input };
