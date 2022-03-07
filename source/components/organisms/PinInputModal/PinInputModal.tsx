import React, { useState } from "react";
import Button from "../../atoms/Button";
import { Heading, Input, Text } from "../../atoms";
import Wrapper from "../../molecules/Dialog/Wrapper";
import { Modal } from "../../molecules/Modal";
import { BackgroundBlur } from "../../atoms/BackgroundBlur";
import { ButtonContainer, DialogContainer } from "./styled";

export interface PinInputModalProps {
  visible: boolean;
  mainApplicantName: string;
  onClose(): void;
  onPinEntered(pin: string): void;
  error?: string;
}

export default function PinInputModal({
  visible,
  mainApplicantName,
  onClose,
  onPinEntered,
  error,
}: PinInputModalProps): JSX.Element {
  const [pin, setPin] = useState("");

  return (
    <Modal
      visible={visible}
      hide={() => undefined}
      transparent
      presentationStyle="overFullScreen"
      animationType="fade"
      statusBarTranslucent
    >
      <Wrapper>
        <DialogContainer>
          <Heading type="h4">Ange kod</Heading>
          <Text align="center" style={{ marginBottom: 10 }}>
            Ange koden som {mainApplicantName} har fått vid signering
          </Text>
          <Input
            testID="pin-input"
            onChangeText={setPin}
            onBlur={() => undefined}
            onMount={() => undefined}
          />
          {error && (
            <Text align="center" style={{ marginTop: 10 }}>
              {error}
            </Text>
          )}
          <ButtonContainer>
            <Button onClick={onClose} colorSchema="neutral">
              <Text>Avbryt</Text>
            </Button>
            <Button onClick={() => onPinEntered(pin)} colorSchema="red">
              <Text>Lås upp</Text>
            </Button>
          </ButtonContainer>
        </DialogContainer>
        <BackgroundBlur
          blurType="light"
          blurAmount={15}
          reducedTransparencyFallbackColor="white"
        />
      </Wrapper>
    </Modal>
  );
}
