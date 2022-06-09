import React, { useState } from "react";
import { ActivityIndicator } from "react-native";

import Wrapper from "../../molecules/Dialog/Wrapper";
import { Modal } from "../../molecules/Modal";

import { BackgroundBlurWrapper } from "../../atoms/BackgroundBlur";
import { Text, Button, Input, TextButton } from "../../atoms";

import { ValidationHelper } from "../../../helpers";

import {
  DialogContainer,
  Container,
  InputLabel,
} from "./AddCoApplicantModal.styled";

enum InputField {
  personalNumber = "personalNumber",
  fistName = "firstName",
  lastName = "lastName",
}

interface AddCoApplicantContentProps {
  visible: boolean;
  isLoading?: boolean;
  errorMessage?: string;
  onClose: () => void;
  onAddCoApplicant: (parameters: {
    personalNumber: string;
    lastName: string;
    firstName: string;
  }) => Promise<void>;
}

const AddCoApplicantContent = ({
  visible,
  isLoading = false,
  errorMessage,
  onClose,
  onAddCoApplicant,
}: AddCoApplicantContentProps): JSX.Element => {
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
      label: "Personnummer",
      placeholder: "ååååmmddxxxx",
      value: inputValue.personalNumber,
      maxLength: 12,
      onChange: setPersonalNumber,
    },
    {
      testId: "first-name-input",
      label: "Förnamn",
      value: inputValue.firstName,
      onChange: setFirstName,
    },
    {
      testId: "last-name-input",
      label: "Efternamn",
      value: inputValue.lastName,
      onChange: setLastName,
    },
  ];

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

              {inputFields.map((input) => (
                <React.Fragment key={input.testId}>
                  <InputLabel strong>{input.label}</InputLabel>
                  <Input
                    testID={input.testId}
                    onChangeText={input.onChange}
                    onBlur={() => undefined}
                    onMount={() => undefined}
                    placeholder={input.placeholder}
                    value={input.value}
                    maxLength={input.maxLength}
                  />
                </React.Fragment>
              ))}
            </Container>
            <Container>
              {isLoading && <ActivityIndicator size="large" />}

              {!isLoading && (
                <Button
                  size="large"
                  fullWidth
                  colorSchema="red"
                  disabled={
                    inputValue.personalNumber.length !== 12 ||
                    !inputValue.firstName ||
                    !inputValue.lastName
                  }
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
};

export default AddCoApplicantContent;
