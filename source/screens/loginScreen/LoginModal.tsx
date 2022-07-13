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

import type { Props } from "./LoginModal.types";

const localDeviceHyperlink =
  "https://support.bankid.com/sv/bankid/mobilt-bankid";

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

  const handleLoginLocalDevice = () => {
    void Linking.openURL(localDeviceHyperlink);
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
              <Link
                href={localDeviceHyperlink}
                onPress={handleLoginLocalDevice}
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
