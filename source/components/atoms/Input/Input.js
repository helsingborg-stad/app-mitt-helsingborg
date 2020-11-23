import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Text from '../Text';

const StyledInput = styled.TextInput`
  width: 100%;
  font-weight: ${({ theme }) => theme.fontWeights[1]}
  background-color: ${({ theme, colorSchema }) => theme.colors.complementary[colorSchema][2]};
  border-radius: 4.5px;
  border: solid 1px
  ${({ theme, error, colorSchema }) =>
    error?.isValid || error === undefined
      ? theme.colors.complementary[colorSchema][2]
      : theme.colors.primary.red[0]};
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
  margin: 3px;
  color: ${({ theme }) => theme.colors.neutrals[0]};
  ${props => (props.center ? 'text-align: center;' : null)}
`;

const StyledErrorText = styled(Text)`
  font-family: Roboto;
  font-size: 16px;
  color: #dd6161;
  font-weight: ${({ theme }) => theme.fontWeights[1]};
  padding-top: 8px;
`;

const Input = props => {
  const { error } = props;

  return (
    <>
      <StyledInput {...props} />
      {error ? <StyledErrorText>{error?.message}</StyledErrorText> : <></>}
    </>
  );
};

Input.propTypes = {
  /**
   * Sets the color schema for the component, default is blue.
   */
  colorSchema: PropTypes.oneOf(['blue', 'red', 'purple', 'green']),
  /**
   * Object with the validation result (isValid) and message to be displayed if validation failed.
   */
  error: PropTypes.shape({ isValid: PropTypes.bool, message: PropTypes.string }),
};

Input.defaultProps = {
  colorSchema: 'blue',
};

export default Input;
