import React, { useContext, useEffect } from "react";
import { StatusBar, TouchableOpacity, View } from "react-native";

import ILLUSTRATION from "../../assets/images/illustrations";

import { Button, EnvironmentPicker, Icon, Text } from "../../components/atoms";

import { AuthLoading } from "../../components/molecules";
import { useModal } from "../../components/molecules/Modal";
import {
  PrivacyModal,
  LoginModal,
  ApiStatusMessages,
} from "../../components/organisms";
import { getUserFriendlyAppVersion } from "../../helpers/Misc";

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
  SafeAreaViewTop,
  Separator,
  Title,
  VersionLabel,
  VersionLabelContainer,
  ApiStatusMessagePosition,
  SettingsButtonContainer,
} from "./LoginScreen.styled";
import theme from "../../theme/theme";
import { AppSettingsModal } from "../../components/organisms/AppSettingsModal";

function LoginScreen(): JSX.Element {
  const {
    handleAuth,
    handleCancelOrder,
    isLoading,
    isIdle,
    isRejected,
    isResolved,
    isMaintenance,
    error,
    handleSetError,
    apiStatusMessages,
  } = useContext(AuthContext);

  const showNotification = useNotification();

  const [loginModalVisible, toggleLoginModal] = useModal();
  const [agreementModalVisible, toggleAgreementModal] = useModal();
  const [settingsModalVisible, toggleSettingsModal] = useModal();
  const { isDevMode } = useContext(AppContext);

  useEffect(() => {
    if (isRejected && error?.message) {
      showNotification("Ett fel inträffade", error.message, "info", 5000);
      handleSetError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const handleLogin = () => {
    handleAuth(undefined, false);
  };

  const isApiStatusMessageVisible = apiStatusMessages.length > 0;

  return (
    <FlexView>
      <SafeAreaViewTop edges={["top", "right", "left"]}>
        <FlexImageBackground source={ILLUSTRATION.ONBOARDING_LOGGA_IN_2}>
          <VersionLabelContainer>
            <VersionLabel>{getUserFriendlyAppVersion()}</VersionLabel>
          </VersionLabelContainer>

          <SettingsButtonContainer>
            <TouchableOpacity activeOpacity={0.6} onPress={toggleSettingsModal}>
              <View>
                <Icon name="settings" />
              </View>
            </TouchableOpacity>
          </SettingsButtonContainer>

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

          {(isLoading || isResolved) && !isMaintenance && (
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

          {(isIdle || isRejected) && !isMaintenance && (
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

          <EnvironmentPicker />

          <Footer>
            <FooterText>
              När du använder appen Mitt Helsingborg behandlar Helsingborgs stad
              dina{" "}
              <ParagraphLink onPress={toggleAgreementModal}>
                personuppgifter
              </ParagraphLink>
              .
            </FooterText>
          </Footer>
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

      <AppSettingsModal
        visible={settingsModalVisible}
        toggle={toggleSettingsModal}
      />
    </FlexView>
  );
}

export default LoginScreen;
