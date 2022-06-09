import React, { useState } from "react";
import { ActivityIndicator } from "react-native";

import Wrapper from "../../molecules/Dialog/Wrapper";
import { Modal } from "../../molecules/Modal";

import { BackgroundBlurWrapper } from "../../atoms/BackgroundBlur";
import { Text, Button, TextButton } from "../../atoms";

import { ValidationHelper } from "../../../helpers";

import InputFields from "./InputFields";

import {
  DialogContainer,
  Container,
  ErrorText,
} from "./AddCoApplicantModal.styled";

import type { Props } from "./AddCoApplicantModal.types";
import { InputField } from "./AddCoApplicantModal.types";

export default function AddCoApplicantModal({
  visible,
  isLoading = false,
  errorMessage = "",
  onClose,
  onAddCoApplicant,
}: Props): JSX.Element {
  const [inputValue, setInputValues] = useState({
    [InputField.personalNumber]: "",
    [InputField.fistName]: "",
    [InputField.lastName]: "",
  });

  const setInputValue = (key: InputField, value: string) => {
    setInputValues((oldValues) => ({
      ...oldValues,
      [key]: value,
    }));
  };

  const setPersonalNumber = (value: string) => {
    const sanitizedValue = ValidationHelper.sanitizePin(value);
    setInputValue(InputField.personalNumber, sanitizedValue);
  };

  const setLastName = (value: string) =>
    setInputValue(InputField.lastName, value);

  const setFirstName = (value: string) =>
    setInputValue(InputField.fistName, value);

  const handleAddCoApplicant = async () => {
    await onAddCoApplicant(inputValue);
  };

  const inputFields = [
    {
      testId: "personal-number-input",
      label: "Personnummer*",
      placeholder: "ååååmmddxxxx",
      keyboardType: "number-pad",
      value: inputValue.personalNumber,
      maxLength: 12,
      onChange: setPersonalNumber,
    },
    {
      testId: "first-name-input",
      label: "Förnamn*",
      value: inputValue.firstName,
      onChange: setFirstName,
    },
    {
      testId: "last-name-input",
      label: "Efternamn*",
      value: inputValue.lastName,
      onChange: setLastName,
    },
  ];

  const invalidInput =
    inputValue.personalNumber.length !== 12 ||
    !inputValue.firstName ||
    !inputValue.lastName;

  return (
    <Modal
      visible={visible}
      transparent
      presentationStyle="overFullScreen"
      animationType="fade"
      statusBarTranslucent
    >
      <BackgroundBlurWrapper>
        <Wrapper>
          <DialogContainer>
            <Container border>
              <Text>
                Ange personnummer, namn och efternamn för din fru, man eller
                sambo
              </Text>

              <InputFields fields={inputFields} />

              {!!errorMessage && <ErrorText>{errorMessage}</ErrorText>}
            </Container>
            <Container>
              {isLoading && <ActivityIndicator size="large" />}

              {!isLoading && (
                <Button
                  size="large"
                  fullWidth
                  colorSchema="red"
                  disabled={invalidInput}
                  onClick={handleAddCoApplicant}
                >
                  <Text>Nästa</Text>
                </Button>
              )}
            </Container>
            <TextButton label="Avbryt" onPress={onClose} disabled={isLoading} />
          </DialogContainer>
        </Wrapper>
      </BackgroundBlurWrapper>
    </Modal>
  );
}
