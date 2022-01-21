import React, { useContext, useEffect, useState } from "react";
import { Alert, Linking, View, StatusBar } from "react-native";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RenderRules } from "react-native-markdown-display";
import RNPickerSelect from "react-native-picker-select";
import AppContext from "../store/AppContext";
import { SLIDES } from "../assets/images";
import Button from "../components/atoms/Button";
import Heading from "../components/atoms/Heading";
import Input from "../components/atoms/Input";
import Text from "../components/atoms/Text";
import AuthLoading from "../components/molecules/AuthLoading";
import BackNavigation from "../components/molecules/BackNavigation";
import { Modal, useModal } from "../components/molecules/Modal";
import { ValidationHelper } from "../helpers";
import AuthContext from "../store/AuthContext";
import { useNotification } from "../store/NotificationContext";
import MarkdownConstructor from "../helpers/MarkdownConstructor";
import userAgreementText from "../assets/text/userAgreementText";
import backgroundImage from "../assets/images/illustrations/onboarding_05_logga-in_2x.png";
import { getUserFriendlyAppVersion } from "../helpers/Misc";
import theme from "../styles/theme";
import EnvironmentConfigurationService from "../services/EnvironmentConfigurationService";

const { sanitizePin, validatePin } = ValidationHelper;
const UnifiedPadding = [24, 48];

const SafeAreaViewTop = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(props) => props.theme.colors.neutrals[6]};
`;

const FlexView = styled.View`
  flex: 1;
`;

const FlexImageBackground = styled.ImageBackground`
  flex: 1;
  resize-mode: cover;
  justify-content: center;
`;

const Header = styled.View`
  flex: 3;
  justify-content: center;
  padding: 0px 48px 0px 48px;
`;

const Form = styled.View`
  flex: 1;
  padding: ${UnifiedPadding[0]}px ${UnifiedPadding[1]}px ${UnifiedPadding[0]}px
    ${UnifiedPadding[1]}px;
  justify-content: center;
  align-items: center;
  height: 250px;
`;

const UserAgreementForm = styled.View`
  padding: ${UnifiedPadding[0]}px ${UnifiedPadding[1]}px ${UnifiedPadding[0]}px
    ${UnifiedPadding[1]}px;
`;

const UserAgreementFooter = styled.View`
  padding: ${UnifiedPadding[0]}px ${UnifiedPadding[1]}px ${UnifiedPadding[0]}px
    ${UnifiedPadding[1]}px;
`;

const Footer = styled.View`
  flex: 1;
  max-height: 130px;
  padding: ${UnifiedPadding[0]}px ${UnifiedPadding[1]}px ${UnifiedPadding[0]}px
    ${UnifiedPadding[1]}px;
  border-top-color: ${(props) => props.theme.border.default};
  border-top-width: 1px;
  background-color: ${(props) => props.theme.colors.neutrals[5]};
`;

const Logo = styled.Image`
  width: 35px;
  height: 70px;
  margin-bottom: 24px;
`;

const Title = styled(Heading)`
  font-size: ${(props) => props.theme.fontSizes[3]}px;
  color: ${(props) => props.theme.colors.primary.red[0]};
  font-weight: ${(props) => props.theme.fontWeights[1]};
`;

const LoginHeading = styled(Heading)`
  font-size: ${(props) => props.theme.fontSizes[13]}px;
  font-weight: ${(props) => props.theme.fontWeights[1]};
  line-height: 60px;
  color: ${(props) => props.theme.colors.neutrals[0]};
`;

const ModalHeading = styled(Heading)`
  font-size: ${(props) => props.theme.fontSizes[9]}px;
  font-weight: ${(props) => props.theme.fontWeights[1]};
  line-height: 44px;
  color: ${(props) => props.theme.colors.neutrals[0]};
`;

const ContentText = styled(Text)`
  font-size: ${(props) => props.theme.fontSizes[4]}px;
  line-height: 30px;
`;

const Separator = styled.View`
  border-radius: 40px;
  height: 2px;
  width: 25px;
  background-color: ${(props) => props.theme.colors.complementary.red[0]};
  margin-bottom: 16px;
`;

const LoginModal = styled(Modal)`
  background-color: ${(props) => props.theme.colors.neutrals[6]};
`;

const CloseModalButton = styled(BackNavigation)`
  padding: 24px;
`;

const FooterText = styled(Text)`
  font-style: italic;
  color: ${(props) => props.theme.colors.neutrals[2]};
  text-align: center;
`;

const Link = styled(Text)`
  font-size: ${(props) => props.theme.fontSizes[3]}px;
  text-align: center;
  margin-top: 16px;
  font-weight: normal;
`;

const ParagraphLink = styled(Text)`
  font-style: italic;
  font-size: ${(props) => props.theme.fontSizes[2]}px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.neutrals[1]};
`;

const LoginInput = styled(Input)`
  margin: 0px;
  margin-bottom: 32px;
`;

const Label = styled(Text)`
  text-align: center;
  margin-bottom: 8px;
`;

const VersionLabelContainer = styled(View)`
  position: relative;
  top: 10px;
  left: 10px;
`;

const VersionLabel = styled(Text)`
  padding: 2px 5px;
  background-color: ${(props) => props.theme.colors.neutrals[6]};
  align-self: flex-start;
`;

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
  },
  inputAndroid: {
    color: "black",
  },
};

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
  } = useContext(AuthContext);
  const showNotification = useNotification();

  const [loginModalVisible, toggleLoginModal] = useModal();
  const [agreementModalVisible, toggleAgreementModal] = useModal();
  const [personalNumber, setPersonalNumber] = useState("");

  const { isDevMode } = useContext(AppContext);
  /**
   * Setup for markdown formatter used to render user agreement text.
   */
  const userAgreementMarkdownRules: RenderRules = {
    text: (node) => (
      <Text style={{ fontSize: 16 }} key={node.key}>
        {node.content}
      </Text>
    ),
    bullet_list: (node, children, _parent, styles) => (
      <View key={node.key} style={[styles.list, styles.listUnordered]}>
        {children}
      </View>
    ),
  };

  /**
   * Effect for showing notification if an error occurs
   */
  useEffect(() => {
    if (isRejected && error?.message) {
      showNotification("Ett fel inträffade", error.message, "info", 5000);
      handleSetError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  /**
   * Handles the personal number input field changes and updates state.
   */
  const handlePersonalNumber = (value: string) => {
    setPersonalNumber(sanitizePin(value));
  };

  const onEnvironmentSelectionChange = (value) => {
    EnvironmentConfigurationService.getInstance().activeEndpoint = value;
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

          {(isIdle || isRejected) && (
            <Form>
              <Button
                z={0}
                size="large"
                block
                onClick={() => handleLogin()}
                colorSchema="red"
              >
                <Text>Logga in med Mobilt BankID</Text>
              </Button>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <Link onPress={toggleLoginModal}>Fler alternativ</Link>
            </Form>
          )}
          {isDevMode && (
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

      <LoginModal visible={loginModalVisible} hide={toggleLoginModal}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          extraScrollHeight={50}
        >
          <CloseModalButton
            onClose={toggleLoginModal}
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
      </LoginModal>

      <LoginModal visible={agreementModalVisible} hide={toggleAgreementModal}>
        <KeyboardAwareScrollView>
          <CloseModalButton
            onClose={toggleAgreementModal}
            primary={false}
            showBackButton={false}
            colorSchema="red"
            isSubstep={false}
          />
          <UserAgreementForm>
            <MarkdownConstructor
              rules={userAgreementMarkdownRules}
              rawText={userAgreementText}
            />
          </UserAgreementForm>
          <UserAgreementFooter>
            <Button
              z={0}
              block
              onClick={toggleAgreementModal}
              colorSchema="red"
            >
              <Text>Återvänd till inloggning</Text>
            </Button>
          </UserAgreementFooter>
        </KeyboardAwareScrollView>
      </LoginModal>
    </FlexView>
  );
}

export default LoginScreen;
