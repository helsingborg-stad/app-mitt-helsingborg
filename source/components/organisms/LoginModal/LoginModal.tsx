import React, { useState } from "react";
import { Alert, Linking, StatusBar, KeyboardAvoidingView } from "react-native";

import { Button, Text } from "../../atoms";

import AuthLoading from "../../molecules/AuthLoading";

import { ValidationHelper } from "../../../helpers";

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

import type { Props } from "./LoginModal.types";

const bankIdSupportUrl = "https://support.bankid.com/sv/bankid/mobilt-bankid";

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
}: Props): JSX.Element {
  const [personalNumber, setPersonalNumber] = useState("");

  const handlePersonalNumber = (value: string) => {
    setPersonalNumber(sanitizePin(value));
  };

  const handleLoginExternalDevice = async () => {
    if (!validatePin(personalNumber)) {
      Alert.alert("Felaktigt personnummer. Ange format: ååååmmddxxxx.");
    } else {
      await handleAuth(personalNumber, true);
    }
  };

  const handleOpenExternalLink = () => {
    void Linking.openURL(bankIdSupportUrl);
  };

  return (
    <Modal visible={visible} hide={toggle}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
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
                onSubmitEditing={handleLoginExternalDevice}
                center
              />
              <Button
                z={0}
                disabled={personalNumber.length !== 12}
                size="large"
                block
                onClick={handleLoginExternalDevice}
                colorSchema="red"
              >
                <Text>Logga in</Text>
              </Button>
              <Link href={bankIdSupportUrl} onPress={handleOpenExternalLink}>
                Läs mer om hur du skaffar Mobilt BankID
              </Link>
            </Form>
          )}
        </FlexView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default LoginModal;
