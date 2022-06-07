import React, { useState } from "react";
import { ActivityIndicator } from "react-native";

import Wrapper from "../../molecules/Dialog/Wrapper";
import { Modal } from "../../molecules/Modal";

import { BackgroundBlurWrapper } from "../../atoms/BackgroundBlur";
import { Text, Button, Input, TextButton } from "../../atoms";

import { ValidationHelper } from "../../../helpers";

import { DialogContainer, Container } from "./AddCoApplicantModal.styled";

interface AddCoApplicantContentProps {
  visible: boolean;
  isLoading?: boolean;
  errorMessage?: string;
  onClose: () => void;
  onAddCoApplicant: (personalNumber: string) => Promise<void>;
}

const AddCoApplicantContent = ({
  visible,
  isLoading = false,
  errorMessage,
  onClose,
  onAddCoApplicant,
}: AddCoApplicantContentProps): JSX.Element => {
  const [personalNumber, setPersonalNumber] = useState("");

  const handleInputChange = (value: string) => {
    const sanitizedValue = ValidationHelper.sanitizePin(value);
    setPersonalNumber(sanitizedValue);
  };

  const handleAddCoApplicant = async () => {
    await onAddCoApplicant(personalNumber);
  };

  return (
    <Modal
      visible={visible}
      hide={onClose}
      transparent
      presentationStyle="overFullScreen"
      animationType="fade"
      statusBarTranslucent
    >
      <BackgroundBlurWrapper>
        <Wrapper>
          <DialogContainer>
            <Container border>
              <Text>Ange personnummer för din fru, man eller sambo</Text>
              <Text
                style={{ width: "100%", paddingTop: 8, paddingBottom: 4 }}
                align="left"
                strong
              >
                Personnummer
              </Text>
              <Input
                testID="personal-number-input"
                onChangeText={handleInputChange}
                onBlur={() => undefined}
                onMount={() => undefined}
                placeholder="ååååmmddxxxx"
                value={personalNumber}
                maxLength={12}
                showErrorMessage={!!errorMessage}
                error={{ message: errorMessage ?? "", isValid: false }}
              />
            </Container>
            <Container>
              {isLoading && <ActivityIndicator size="large" />}

              {!isLoading && (
                <Button
                  size="large"
                  fullWidth
                  colorSchema="red"
                  disabled={personalNumber.length !== 12}
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
