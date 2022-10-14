import React, { useState } from "react";

import Button from "../../atoms/Button";
import { Input, Text } from "../../atoms";
import Wrapper from "../../molecules/Dialog/Wrapper";
import { Modal } from "../../molecules/Modal";
import { BackgroundBlurWrapper } from "../../atoms/BackgroundBlur";

import { ButtonContainer, DialogContainer, ErrorText } from "./styled";

export interface PinInputModalProps {
  visible: boolean;
  name: string;
  error?: string;
  onClose(): void;
  onPinEntered(pin: string): void;
}

export default function PinInputModal({
  visible,
  name,
  onClose,
  onPinEntered,
  error,
}: PinInputModalProps): JSX.Element {
  const [pin, setPin] = useState("");

  const handleUnlockPressed = () => {
    onPinEntered(pin);
  };

  const handleClosePressed = () => {
    setPin("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      hide={handleClosePressed}
      transparent
      presentationStyle="overFullScreen"
      animationType="fade"
      statusBarTranslucent
    >
      <BackgroundBlurWrapper>
        <Wrapper>
          <DialogContainer>
            <Text type="h4">Ange kod</Text>
            <Text align="center" style={{ marginBottom: 10 }}>
              Ange koden som {name} har fått vid signering
            </Text>
            <Input
              testID="pin-input"
              onChangeText={setPin}
              onBlur={() => undefined}
              onMount={() => undefined}
              keyboardType="number-pad"
            />
            {error && <ErrorText>{error}</ErrorText>}
            <ButtonContainer>
              <Button onClick={handleClosePressed} colorSchema="neutral">
                <Text>Avbryt</Text>
              </Button>
              <Button onClick={handleUnlockPressed} colorSchema="red">
                <Text>Lås upp</Text>
              </Button>
            </ButtonContainer>
          </DialogContainer>
        </Wrapper>
      </BackgroundBlurWrapper>
    </Modal>
  );
}
