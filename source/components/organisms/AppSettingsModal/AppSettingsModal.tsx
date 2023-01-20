/* eslint-disable import/no-unused-modules */
import React, { useState, useCallback, useEffect, useContext } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import { EnvironmentContext } from "../../../store/EnvironmentContext";
import { Text } from "../../atoms";
import { StyledTextInput } from "../../atoms/Input/Input.styled";
import {
  Modal,
  CloseModalButton,
  Body,
  TitleText,
  HeadingText,
  ErrorText,
  ResetButton,
  SpinnerContainer,
} from "./AppSettingsModal.styled";

export interface AppSettingsModalProps {
  visible: boolean;
  toggle: () => void;
}

function sanitizeJsonInput(input: string): string {
  return input.replace(/[“”]/g, '"');
}

export default function AppSettingsModal({
  visible,
  toggle,
}: AppSettingsModalProps): JSX.Element | null {
  const { parse, serializedEnvironmentConfig } = useContext(EnvironmentContext);
  const [appConfig, setAppConfig] = useState(serializedEnvironmentConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (visible) {
      setAppConfig(serializedEnvironmentConfig);
    }
  }, [serializedEnvironmentConfig, visible]);

  const parseFromAppConfig = useCallback(() => {
    setIsLoading(true);
    parse(appConfig)
      .then(() => {
        toggle();
      })
      .catch(() => {
        setErrorMessage(
          "Ett fel uppstod. Dubbelkolla inställningarna och försök igen."
        );
      })
      .finally(() => setIsLoading(false));
  }, [appConfig, parse, toggle, setErrorMessage]);

  const updateAppConfig = useCallback(() => {
    parseFromAppConfig();
  }, [parseFromAppConfig]);

  const onClose = () => {
    updateAppConfig();
    setErrorMessage("");
  };

  const resetConfigToDefault = () => {
    setAppConfig("{}");
  };

  const setAppConfigSafe = (input: string) => {
    const sanitized = sanitizeJsonInput(input);
    setAppConfig(sanitized);
  };

  return visible ? (
    <Modal visible={visible} hide={onClose}>
      <ScrollView>
        <CloseModalButton
          onClose={onClose}
          primary={false}
          showBackButton={false}
          colorSchema="red"
          isSubstep={false}
          onBack={() => undefined}
        />
        <Body>
          <TitleText>APP INSTÄLLNINGAR</TitleText>

          <HeadingText>APP KONFIGURATION</HeadingText>
          <StyledTextInput
            colorSchema="neutral"
            center={false}
            hidden={false}
            transparent={false}
            error={{ isValid: true, message: "" }}
            value={appConfig}
            onChangeText={setAppConfigSafe}
          />
          <ResetButton colorSchema="red" onClick={resetConfigToDefault}>
            <Text>Återställ</Text>
          </ResetButton>

          {errorMessage ? <ErrorText>{errorMessage}</ErrorText> : null}

          {isLoading ? (
            <SpinnerContainer>
              <ActivityIndicator
                style={{ flex: 1, justifyContent: "center" }}
                size="large"
              />
            </SpinnerContainer>
          ) : null}
        </Body>
      </ScrollView>
    </Modal>
  ) : null;
}
