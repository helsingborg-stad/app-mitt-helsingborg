import React from 'react';
import PropTypes from 'prop-types';
import { TextInputProps } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import Text from '../Text';

type InputProps = Omit<TextInputProps, 'onBlur'> & {
  onBlur: (value: string) => void;
  center?: boolean;
  transparent?: boolean;
  colorSchema?: 'blue' | 'green' | 'red' | 'purple';
  showErrorMessage?: boolean;
  error?: { isValid: boolean; message: string };
  textAlign?: 'left' | 'center' | 'right';
};

const StyledTextInput = styled.TextInput<InputProps>`
  width: 100%;
  font-weight: ${({ theme }) => theme.fontWeights[1]}
  background-color: ${({ theme, colorSchema, transparent }) =>
    transparent ? 'transparent' : theme.colors.complementary[colorSchema][2]};
  border-radius: 4.5px;
  border: solid 1px
  ${({ theme, error }) =>
    error?.isValid || error === undefined ? 'transparent' : theme.colors.primary.red[0]};
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
  margin: 3px;
  color: ${({ theme }) => theme.colors.neutrals[0]};
  ${props => (props.center ? 'text-align: center;' : null)}
`;

const StyledErrorText = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes[3]};
  color: ${props => props.theme.textInput.errorTextColor};
  font-weight: ${({ theme }) => theme.fontWeights[1]};
  padding-top: 8px;
`;

const Input: React.FC<InputProps> = ({ onBlur, showErrorMessage, ...props }) => {
  const { value, error } = props;

  const handleBlur = () => {
    if (onBlur) onBlur(value);
  };
  const theme = useTheme();
  return (
    <>
      <StyledTextInput
        multiline /** Temporary fix to make field scrollable inside scrollview */
        numberOfLines={1} /** Temporary fix to make field scrollable inside scrollview */
        onBlur={handleBlur}
        placeholderTextColor={theme.colors.neutrals[1]}
        {...props}
      />
      {showErrorMessage && error ? <StyledErrorText>{error?.message}</StyledErrorText> : <></>}
    </>
  );
};

Input.propTypes = {
  value: PropTypes.string,
  /**
   * Default is blue.
   */
  colorSchema: PropTypes.oneOf(['blue', 'red', 'purple', 'green']),
  /** Whether or not to show the error message as red text below the input field */
  showErrorMessage: PropTypes.bool,
  error: PropTypes.shape({
    isValid: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
  }),
  onBlur: PropTypes.func,
};

Input.defaultProps = {
  colorSchema: 'blue',
};

export default Input;
