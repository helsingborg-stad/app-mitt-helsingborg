import React from 'react';
import { TextInput } from 'react-native';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/native';
import colors from '../../../styles/colors';
import { validateInput } from '../../../helpers/ValidationHelper';

const input = css`
  width: 100%;
  background-color: ${({ color }) => colors.input[color].background};
  border-radius: 17.5px;
  border: solid 1px ${({ color, isValid }) => isValid ? colors.input[color].border : colors.input['red'].border};
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
  const { color, validation } = props;
  const isValid = validation?.isRequired ? validateInput(props.value, validation?.rules)[0] : true;

  return React.createElement(inputText, {
    placeholderTextColor: colors.input[color].placeholder,
    isValid,
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
