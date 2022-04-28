import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  TextInputProps,
  Keyboard,
  TextInput,
  KeyboardTypeOptions,
  InputAccessoryView,
  View,
  Button,
  Dimensions,
  Platform,
} from "react-native";
import styled, { useTheme } from "styled-components/native";
import Text from "../Text";
import { InputFieldType } from "../../../types/FormTypes";

type InputProps = Omit<TextInputProps, "onBlur"> & {
  onBlur: (value: string) => void;
  onMount: (value: string) => void;
  center?: boolean;
  transparent?: boolean;
  colorSchema?: "neutral" | "blue" | "green" | "red" | "purple";
  showErrorMessage?: boolean;
  hidden?: boolean;
  error?: { isValid: boolean; message: string };
  textAlign?: "left" | "center" | "right";
  inputType?: InputFieldType;
};

const keyboardTypes: Record<InputFieldType, KeyboardTypeOptions> = {
  text: "default",
  number: "number-pad",
  email: "email-address",
  postalCode: "number-pad",
  phone: "phone-pad",
  date: "default",
  personalNumber: "number-pad",
};

const keyboardTypeExtraProp: Record<InputFieldType, Partial<InputProps>> = {
  text: {},
  number: {},
  email: {
    autoCapitalize: "none",
    autoCorrect: false,
  },
  postalCode: {},
  phone: {},
  date: {},
  personalNumber: {},
};

const StyledTextInput = styled.TextInput<InputProps>`
  width: 100%;
  font-weight: ${({ theme }) => theme.fontWeights[0]};
  background-color: ${(props) =>
    props.theme.colors.complementary[props.colorSchema][2]};
  ${({ transparent }) => transparent && `background-color: transparent;`}
  border-radius: 4.5px;
  border: solid 1px
    ${({ theme, error }) =>
      error?.isValid || error === undefined
        ? "transparent"
        : theme.colors.primary.red[0]};
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
  color: ${({ theme }) => theme.colors.neutrals[0]};
  ${(props) => (props.center ? "text-align: center;" : null)}
  ${(props) => (props.hidden ? "display: none;" : null)}
`;

const StyledErrorText = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes[3]}px;
  color: ${(props) => props.theme.textInput.errorTextColor};
  font-weight: ${({ theme }) => theme.fontWeights[0]};
  padding-top: 8px;
`;

const StyledAccessoryViewChild = styled(View)`
  width: ${Dimensions.get("window").width}px;
  height: 48px;
  flexdirection: row;
  justifycontent: flex-end;
  alignitems: center;
  backgroundcolor: #f8f8f8;
  paddinghorizontal: 8px;
`;

const replaceSpace = (str?: string) => {
  if (typeof str === "string") {
    return str?.replace(/\u00A0/g, "\u0020");
  }

  console.log("bad type for replaceSpace:", typeof str, str);
  return str;
};

const Input: React.FC<InputProps> = React.forwardRef(
  (
    {
      onBlur,
      onMount,
      showErrorMessage,
      value,
      error,
      inputType,
      keyboardType,
      ...props
    },
    ref
  ) => {
    const handleBlur = () => {
      if (onBlur) onBlur(value);
    };
    const handleMount = () => {
      if (onMount) onMount(value);
    };
    const theme = useTheme();
    const smartKeyboardType = inputType
      ? keyboardTypes[inputType]
      : keyboardType;
    const smartKeyboardExtraProps = inputType
      ? keyboardTypeExtraProp[inputType]
      : {};

    useEffect(handleMount, []);

    return (
      <>
        <StyledTextInput
          value={replaceSpace(value)}
          multiline /** Temporary fix to make field scrollable inside scrollview */
          numberOfLines={
            1
          } /** Temporary fix to make field scrollable inside scrollview */
          onBlur={handleBlur}
          placeholderTextColor={theme.colors.neutrals[1]}
          returnKeyType="done"
          returnKeyLabel="Klar" // Only works on Android
          blurOnSubmit
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
          inputAccessoryViewID="klar-accessory"
          keyboardType={smartKeyboardType}
          ref={ref as React.Ref<TextInput>}
          {...smartKeyboardExtraProps}
          {...props}
        />
        {showErrorMessage && error ? (
          <StyledErrorText>{error?.message}</StyledErrorText>
        ) : (
          <></>
        )}

        {Platform.OS === "ios" &&
        inputType !== "email" &&
        inputType !== "text" ? (
          <InputAccessoryView nativeID="klar-accessory">
            <StyledAccessoryViewChild>
              <Button title="Klar" onPress={() => Keyboard.dismiss()} />
            </StyledAccessoryViewChild>
          </InputAccessoryView>
        ) : null}
      </>
    );
  }
);

Input.propTypes = {
  value: PropTypes.string,
  /**
   * Default is blue.
   */
  colorSchema: PropTypes.oneOf(["neutral", "blue", "red", "purple", "green"]),
  /** Whether or not to show the error message as red text below the input field */
  showErrorMessage: PropTypes.bool,
  error: PropTypes.shape({
    isValid: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
  }),
  onBlur: PropTypes.func,
};

Input.defaultProps = {
  colorSchema: "blue",
};

export default Input;
