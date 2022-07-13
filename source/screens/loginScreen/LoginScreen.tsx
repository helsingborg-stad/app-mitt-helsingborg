import React, { useContext, useEffect } from "react";
import { StatusBar } from "react-native";
import RNPickerSelect from "react-native-picker-select";

import { SLIDES } from "../../assets/images";
import backgroundImage from "../../assets/images/illustrations/onboarding_05_logga-in_2x.png";

import { Button, Icon, Text } from "../../components/atoms";
import AuthLoading from "../../components/molecules/AuthLoading";
import { useModal } from "../../components/molecules/Modal";

import { getUserFriendlyAppVersion } from "../../helpers/Misc";

import EnvironmentConfigurationService from "../../services/EnvironmentConfigurationService";

import AppContext from "../../store/AppContext";
import AuthContext from "../../store/AuthContext";
import { useNotification } from "../../store/NotificationContext";

import LoginModal from "./LoginModal";
import PrivacyModal from "./PrivacyModal";

import {
  ApiStatusMessageContainer,
  ContentText,
  FlexImageBackground,
  FlexView,
  Footer,
  FooterText,
  Form,
  Header,
  Link,
  LoginHeading,
  Logo,
  ParagraphLink,
  pickerSelectStyles,
  SafeAreaViewTop,
  Separator,
  Title,
  VersionLabel,
  VersionLabelContainer,
} from "./LoginScreen.styled";
import theme from "../../styles/theme";

function LoginScreen(): JSX.Element {
  const {
    handleAuth,
    handleCancelOrder,
    isLoading,
    isIdle,
    isRejected,
    isResolved,
    error,
    handleSetError,
    apiStatusMessage,
  } = useContext(AuthContext);
  const showNotification = useNotification();

  const [loginModalVisible, toggleLoginModal] = useModal();
  const [agreementModalVisible, toggleAgreementModal] = useModal();

  const { isDevMode } = useContext(AppContext);

  useEffect(() => {
    if (isRejected && error?.message) {
      showNotification("Ett fel inträffade", error.message, "info", 5000);
      handleSetError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const onEnvironmentSelectionChange = (value) => {
    EnvironmentConfigurationService.getInstance().activeEndpoint = value;
  };

  const handleLogin = async () => {
    await handleAuth(undefined, false);
  };

  return (
    <FlexView>
      <SafeAreaViewTop edges={["top", "right", "left"]}>
        <FlexImageBackground source={backgroundImage}>
          <VersionLabelContainer>
            <VersionLabel>{getUserFriendlyAppVersion()}</VersionLabel>
          </VersionLabelContainer>
          <StatusBar
            barStyle="dark-content"
            backgroundColor={theme.colors.neutrals[6]}
          />
          <Header>
            <Logo source={SLIDES.STADSVAPEN_PNG} resizeMode="contain" />
            <Title>Mitt Helsingborg</Title>
            <Separator />
            <LoginHeading>Välkommen!</LoginHeading>
            <ContentText>
              Till en enklare kontakt med Helsingborgs stad.
            </ContentText>
          </Header>

          {!!apiStatusMessage && (
            <ApiStatusMessageContainer>
              <Icon
                name="error-outline"
                size={48}
                color={theme.colors.primary.red[2]}
              />
              <Text
                strong
                type="h5"
                style={{ color: theme.colors.primary.red[0] }}
              >
                Oh no!
              </Text>
              <Text
                strong
                style={{
                  color: theme.colors.primary.red[0],
                  textAlign: "center",
                }}
              >
                {apiStatusMessage}
              </Text>
            </ApiStatusMessageContainer>
          )}

          {(isLoading || isResolved) && (
            <Form>
              <AuthLoading
                colorSchema="red"
                isLoading={isLoading}
                isResolved={isResolved}
                cancelSignIn={handleCancelOrder}
                authenticateOnExternalDevice={false}
              />
            </Form>
          )}

          {(isIdle || isRejected) && !apiStatusMessage && (
            <Form>
              <Button
                z={0}
                size="large"
                block
                onClick={handleLogin}
                colorSchema="red"
              >
                <Text>Logga in med Mobilt BankID</Text>
              </Button>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <Link onPress={toggleLoginModal}>Fler alternativ</Link>
            </Form>
          )}
          {isDevMode && !apiStatusMessage && (
            <RNPickerSelect
              onValueChange={onEnvironmentSelectionChange}
              placeholder={{}}
              items={
                EnvironmentConfigurationService.getInstance().environmentOptions
              }
              itemKey={
                EnvironmentConfigurationService.getInstance().activeEndpoint
                  .name
              }
              style={pickerSelectStyles}
            />
          )}

          {!apiStatusMessage && (
            <Footer>
              <FooterText>
                När du använder appen Mitt Helsingborg behandlar Helsingborgs
                stad dina{" "}
                <ParagraphLink onPress={toggleAgreementModal}>
                  personuppgifter
                </ParagraphLink>
                .
              </FooterText>
            </Footer>
          )}
        </FlexImageBackground>
      </SafeAreaViewTop>

      <LoginModal
        isIdle={isIdle}
        isLoading={isLoading}
        isRejected={isRejected}
        isResolved={isResolved}
        visible={loginModalVisible}
        handleAuth={handleAuth}
        toggle={toggleLoginModal}
        handleCancelOrder={handleCancelOrder}
      />

      <PrivacyModal
        visible={agreementModalVisible}
        toggle={toggleAgreementModal}
      />
    </FlexView>
  );
}

export default LoginScreen;
