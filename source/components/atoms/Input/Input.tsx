import React, { useEffect } from "react";
import {
  Keyboard,
  Button,
  Platform,
  View,
  InputAccessoryView,
} from "react-native";
import { useTheme } from "styled-components/native";

import {
  StyledTextInput,
  StyledErrorText,
  AccesoryViewChild,
} from "./Input.styled";

import { Props, KeyboardTypeExtraPropType } from "./Input.types";

const keyboardTypes = {
  text: "default",
  number: "number-pad",
  email: "email-address",
  postalCode: "number-pad",
  phone: "phone-pad",
  date: "default",
  personalNumber: "number-pad",
};

const keyboardTypeExtraProp: KeyboardTypeExtraPropType = {
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

const replaceSpace = (str?: string) => {
  if (typeof str === "string") {
    return str?.replace(/\u00A0/g, "\u0020");
  }

  console.log("bad type for replaceSpace:", typeof str, str);
  return str;
};

export default function Input({
  onBlur,
  onMount,
  showErrorMessage,
  value,
  error,
  inputType,
  keyboardType,
  ...props
}: Props): JSX.Element {
  const handleBlur = () => {
    if (onBlur) onBlur(value);
  };
  const handleMount = () => {
    if (onMount) onMount(value);
  };
  const theme = useTheme();
  const smartKeyboardType = inputType ? keyboardTypes[inputType] : keyboardType;
  const smartKeyboardExtraProps = inputType
    ? keyboardTypeExtraProp[inputType]
    : {};

  useEffect(handleMount, []);

  const showAccessoryDoneButton =
    Platform.OS === "ios" && inputType !== "email" && inputType !== "text";

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
        // ref={ref as React.Ref<TextInput>}
        {...smartKeyboardExtraProps}
        {...props}
      />

      {showErrorMessage && !!error?.message && (
        <StyledErrorText>{error?.message ?? ""}</StyledErrorText>
      )}

      {showAccessoryDoneButton && (
        <InputAccessoryView nativeID="klar-accessory">
          <AccesoryViewChild>
            <View>
              <Button title="Klar" onPress={() => Keyboard.dismiss()} />
            </View>
          </AccesoryViewChild>
        </InputAccessoryView>
      )}
    </>
  );
}
