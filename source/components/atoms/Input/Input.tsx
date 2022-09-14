import React, { useEffect, forwardRef, useRef } from "react";
import type { TextInput } from "react-native";
import {
  Keyboard,
  Button,
  Platform,
  View,
  InputAccessoryView,
} from "react-native";
import uuid from "react-native-uuid";
import { useTheme } from "styled-components/native";

import {
  StyledTextInput,
  StyledErrorText,
  AccesoryViewChild,
} from "./Input.styled";

import type { Props, KeyboardTypeExtraPropType } from "./Input.types";

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

function Input(
  {
    onBlur,
    onMount,
    showErrorMessage,
    value,
    error,
    inputType,
    keyboardType,
    colorSchema = "blue",
    ...props
  }: Props,
  ref: React.Ref<TextInput>
): JSX.Element {
  const uniqueNativeId = useRef<string>(uuid.v4());

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
    Platform.OS === "ios" && !["email", "text"].includes(inputType ?? "");

  return (
    <View>
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
        inputAccessoryViewID={uniqueNativeId.current}
        keyboardType={smartKeyboardType}
        colorSchema={colorSchema}
        {...smartKeyboardExtraProps}
        {...props}
        ref={ref}
      />

      {showErrorMessage && !!error?.message && (
        <StyledErrorText>{error?.message ?? ""}</StyledErrorText>
      )}

      {showAccessoryDoneButton && (
        <InputAccessoryView nativeID={uniqueNativeId.current}>
          <AccesoryViewChild>
            <View>
              <Button title="Klar" onPress={Keyboard.dismiss} />
            </View>
          </AccesoryViewChild>
        </InputAccessoryView>
      )}
    </View>
  );
}

export default forwardRef(Input);
