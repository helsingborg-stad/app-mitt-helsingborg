import React, { useState } from "react";
import { Alert, Linking, StatusBar } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Button, Text } from "../../components/atoms";

import AuthLoading from "../../components/molecules/AuthLoading";

import { ValidationHelper } from "../../helpers";

import {
  CloseModalButton,
  ContentText,
  FlexView,
  Form,
  Header,
  Label,
  Link,
  LoginInput,
  Modal,
  ModalHeading,
  Separator,
  Title,
} from "./LoginModal.styled";

const { sanitizePin, validatePin } = ValidationHelper;

function LoginModal({
  visible,
  isLoading,
  isIdle,
  isRejected,
  isResolved,
  toggle,
  handleAuth,
  handleCancelOrder,
}: {
  visible: boolean;
  isLoading: boolean;
  isIdle: boolean;
  isResolved: boolean;
  isRejected: boolean;
  toggle: () => void;
  handleAuth: (
    personalNumber: string,
    authenticateOnExternalDevice: boolean
  ) => void;
  handleCancelOrder: () => void;
}): JSX.Element {
  const [personalNumber, setPersonalNumber] = useState("");

  /**
   * Handles the personal number input field changes and updates state.
   */
  const handlePersonalNumber = (value: string) => {
    setPersonalNumber(sanitizePin(value));
  };

  /**
   * Handles the submission of the login form.
   */
  const handleLogin = async (authenticateOnExternalDevice = false) => {
    // Validate personal number if authentication is chosen to be triggered on an external device
    if (authenticateOnExternalDevice) {
      if (personalNumber.length <= 0) {
        return;
      }

      if (!validatePin(personalNumber)) {
        Alert.alert("Felaktigt personnummer. Ange format: ååååmmddxxxx.");
        return;
      }

      await handleAuth(personalNumber, true);
      return;
    }
    // Send empty personal number to use the personal number from users BankID app
    await handleAuth(undefined, false);
  };

  return (
    <Modal visible={visible} hide={toggle}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        extraScrollHeight={50}
      >
        <CloseModalButton
          onClose={toggle}
          primary={false}
          showBackButton={false}
          colorSchema="red"
          isSubstep={false}
        />
        <FlexView>
          <Header>
            <Title>Logga in</Title>
            <Separator />
            <ModalHeading>BankID på en annan enhet</ModalHeading>
            <ContentText>
              Öppna Mobilt BankID eller BankID på din andra enhet innan du
              trycker på logga in här nedanför.
            </ContentText>
          </Header>
          {(isLoading || isResolved) && (
            <Form>
              <AuthLoading
                colorSchema="red"
                isLoading={isLoading}
                isResolved={isResolved}
                cancelSignIn={handleCancelOrder}
                authenticateOnExternalDevice
              />
            </Form>
          )}
          {(isIdle || isRejected) && (
            <Form>
              <Label strong>PERSONNUMMER</Label>
              <LoginInput
                colorSchema="neutral"
                placeholder="ååååmmddxxxx"
                value={personalNumber}
                onChangeText={handlePersonalNumber}
                keyboardType="number-pad"
                maxLength={12}
                onSubmitEditing={() => handleLogin(true)}
                center
              />
              <Button
                z={0}
                disabled={personalNumber.length !== 12}
                size="large"
                block
                onClick={() => {
                  void handleLogin(true);
                }}
                colorSchema="red"
              >
                <Text>Logga in</Text>
              </Button>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <Link
                onPress={() => {
                  void Linking.openURL(
                    "https://support.bankid.com/sv/bankid/mobilt-bankid"
                  );
                }}
              >
                Läs mer om hur du skaffar Mobilt BankID
              </Link>
            </Form>
          )}
        </FlexView>
      </KeyboardAwareScrollView>
    </Modal>
  );
}

export default LoginModal;
