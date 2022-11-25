import React, { useContext, useEffect } from "react";
import { StatusBar } from "react-native";
import RNPickerSelect from "react-native-picker-select";

import ILLUSTRATION from "../../assets/images/illustrations";

import { Button, Text } from "../../components/atoms";

import { AuthLoading } from "../../components/molecules";
import { useModal } from "../../components/molecules/Modal";
import {
  PrivacyModal,
  LoginModal,
  ApiStatusMessages,
} from "../../components/organisms";
import { getUserFriendlyAppVersion } from "../../helpers/Misc";

import EnvironmentConfigurationService from "../../services/EnvironmentConfigurationService";

import AppContext from "../../store/AppContext";
import AuthContext from "../../store/AuthContext";
import { useNotification } from "../../store/NotificationContext";

import {
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
  ApiStatusMessagePosition,
} from "./LoginScreen.styled";
import theme from "../../theme/theme";

import type { Endpoint } from "../../services/EnvironmentConfigurationService";

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
    apiStatusMessages,
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

  const onEnvironmentSelectionChange = (value: Endpoint) => {
    EnvironmentConfigurationService.getInstance().activeEndpoint = value;
  };

  const handleLogin = async () => {
    await handleAuth(undefined, false);
  };

  const isApiStatusMessageVisible = apiStatusMessages.length > 0;

  return (
    <FlexView>
      <SafeAreaViewTop edges={["top", "right", "left"]}>
        <FlexImageBackground source={ILLUSTRATION.ONBOARDING_LOGGA_IN_2}>
          <VersionLabelContainer>
            <VersionLabel>{getUserFriendlyAppVersion()}</VersionLabel>
          </VersionLabelContainer>
          <StatusBar
            barStyle="dark-content"
            backgroundColor={theme.colors.neutrals[6]}
          />
          <Header>
            <Logo source={ILLUSTRATION.STADSVAPEN} resizeMode="contain" />
            <Title>Mitt Helsingborg</Title>
            <Separator />
            <LoginHeading>Välkommen!</LoginHeading>
            <ContentText>
              Till en enklare kontakt med Helsingborgs stad.
            </ContentText>
          </Header>

          {isApiStatusMessageVisible && (
            <ApiStatusMessagePosition>
              <ApiStatusMessages messages={apiStatusMessages} />
            </ApiStatusMessagePosition>
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

          {(isIdle || isRejected) && !isApiStatusMessageVisible && (
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

          {isDevMode && !isApiStatusMessageVisible && (
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

          {!isApiStatusMessageVisible && (
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
