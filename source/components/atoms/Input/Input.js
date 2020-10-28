import React from 'react';
import { TextInput } from 'react-native';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/native';
import theme from '../../../styles/theme';

const input = css`
  width: 100%;
  background-color: ${({ color }) => theme.input[color].background};
  border-radius: 17.5px;
  border: solid 1px
    ${({ color, error }) => (error ? colors.input.red.border : colors.input[color].border)};
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
  margin: 3px;
  color: ${({ color }) => theme.input[color].text};
  ${props => (props.center ? 'text-align: center;' : null)}
`;

const Input = styled(TextInput).attrs(props => ({
  placeholderTextColor: props.theme.input[props.color].placeholder,
}))`
  ${input}
`;

Input.propTypes = {
  /**
   * Sets the color theme, default is light.
   */
  color: PropTypes.oneOf(Object.keys(theme.input)),
};

Input.defaultProps = {
  color: 'light',
};

export default Input;
export { input };
