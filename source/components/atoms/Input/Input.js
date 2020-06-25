import React from 'react';
import { TextInput } from 'react-native';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/native';
import colors from '../../../styles/colors';

const input = css`
  width: 100%;
  background-color: ${({ color }) => colors.input[color].background};
  border-radius: 17.5px;
  border: solid 1px ${({ color }) => colors.input[color].border};
  padding: 16px;
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
  color: PropTypes.oneOf(Object.keys(colors.input)),
};

Input.defaultProps = {
  color: 'light',
};

export default Input;
export { input };
