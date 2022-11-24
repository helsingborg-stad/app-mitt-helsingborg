import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

import { Modal } from "../Modal";

import { BackgroundBlurWrapper } from "../../atoms/BackgroundBlur";

import theme from "../../../theme/theme";

import {
  Container,
  Box,
  AuthActivityIndicator,
  InfoText,
  AbortButton,
  ButtonText,
  SuccessIcon,
} from "./AuthLoading.styled";

import type { Props } from "./AuthLoading.types";

const AuthLoading = (props: Props): JSX.Element => {
  const {
    authenticateOnExternalDevice,
    cancelSignIn,
    colorSchema = "neutral",
    isLoading = false,
    isResolved = false,
  } = props;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      easing: Easing.back(1),
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimation]);

  return (
    <>
      {isResolved && (
        <Container as={Animated.View} style={{ opacity: fadeAnimation }}>
          <SuccessIcon
            size={48}
            name="check-circle"
            colorSchema={colorSchema}
          />
        </Container>
      )}

      <Modal
        statusBarTranslucent
        animationType="fade"
        transparent
        presentationStyle="overFullScreen"
        visible={isLoading}
        hide={() => undefined}
      >
        <BackgroundBlurWrapper>
          <Container>
            <Box>
              <AuthActivityIndicator
                size="large"
                color={theme.colors.primary[colorSchema][1]}
              />
              {authenticateOnExternalDevice ? (
                <InfoText>
                  Väntar på att BankID ska startas på en annan enhet
                </InfoText>
              ) : (
                <InfoText>Väntar på mobilt BankID</InfoText>
              )}
              <AbortButton
                z={0}
                colorSchema="neutral"
                size="large"
                onClick={cancelSignIn}
                block
              >
                <ButtonText>Avbryt</ButtonText>
              </AbortButton>
            </Box>
          </Container>
        </BackgroundBlurWrapper>
      </Modal>
    </>
  );
};

export default AuthLoading;
