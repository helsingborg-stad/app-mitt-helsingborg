import React from 'react';
import { TextInput } from 'react-native';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/native';

const input = css`
  width: 100%;
  font-weight: ${({ theme }) => theme.fontWeights[1]}
  background-color: ${({ theme, colorSchema }) => theme.colors.complementary[colorSchema][2]};
  border-radius: 4.5px;
  border: solid 1px
    ${({ theme, error, colorSchema }) =>
      error ? theme.colors.primary.red[0] : theme.colors.complementary[colorSchema][2]};
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
  margin: 3px;
  color: ${({ theme }) => theme.colors.neutrals[0]};
  ${props => (props.center ? 'text-align: center;' : null)}
`;

const Input = styled(TextInput).attrs(props => ({
  placeholderTextColor: props.theme.colors.neutrals[1],
}))`
  ${input}
`;

Input.propTypes = {
  /**
   * Sets the color schema for the component, default is blue.
   */
  colorSchema: PropTypes.oneOf(['blue', 'red', 'purple', 'green']),
};

Input.defaultProps = {
  colorSchema: 'blue',
};

export default Input;
export { input };
