import { useFocusEffect } from '@react-navigation/native';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Alert, Linking, View, StatusBar } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SLIDES } from '../assets/images';
import Button from '../components/atoms/Button';
import Heading from '../components/atoms/Heading';
import Input from '../components/atoms/Input';
import Text from '../components/atoms/Text';
import AuthLoading from '../components/molecules/AuthLoading';
import BackNavigation from '../components/molecules/BackNavigation';
import { Modal, useModal } from '../components/molecules/Modal';
import { ValidationHelper } from '../helpers';
import AuthContext from '../store/AuthContext';
import { useNotification } from '../store/NotificationContext';
import MarkdownConstructor from '../helpers/MarkdownConstructor';
import userAgreementText from '../assets/text/userAgreementText';
import theme from '../styles/theme';

const { sanitizePin, validatePin } = ValidationHelper;
const UnifiedPadding = [24, 48]; // Vertical padding, Horizontal padding

const SafeAreaViewTop = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(props) => props.theme.colors.neutrals[6]};
`;

const FlexView = styled.View`
  flex: 1;
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
  color: ${(props) => props.theme.colors.primary.blue[0]};
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
  opacity: 0.2;
  background-color: ${(props) => props.theme.colors.neutrals[0]};
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
  color: ${(props) => props.theme.colors.primary.blue[0]};
`;

const Link = styled(Text)`
  font-size: ${(props) => props.theme.fontSizes[3]}px;
  text-align: center;
  margin-top: 16px;
`;

const ParagraphLink = styled(Text)`
  font-style: italic;
  font-size: ${(props) => props.theme.fontSizes[2]}px;
  font-weight: bold;
  text-decoration-color: ${(props) => props.theme.colors.primary.blue[0]};
  color: ${(props) => props.theme.colors.primary.blue[0]};
`;

const LoginInput = styled(Input)`
  margin: 0px;
  margin-bottom: 32px;
`;

const Label = styled(Text)`
  text-align: center;
  margin-bottom: 8px;
`;

function LoginScreen(props) {
  const {
    isAuthenticated,
    handleAuth,
    handleCancelOrder,
    isLoading,
    isIdle,
    isRejected,
    isResolved,
    error,
  } = useContext(AuthContext);
  const showNotification = useNotification();

  const [loginModalVisible, toggleLoginModal] = useModal();
  const [agreementModalVisible, toggleAgreementModal] = useModal();
  const [personalNumber, setPersonalNumber] = useState('');

  /**
   * Setup for markdown formatter used to render user agreement text.
   */
  const userAgreementMarkdownRules = {
    text: (node, _children, _parent, _styles) => (
      <Text style={{ fontSize: 16 }} key={node.key}>
        {node.content}
      </Text>
    ),
    bullet_list: (node, children, parent, styles) => (
      <View key={node.key} style={[styles.list, styles.listUnordered]}>
        {children}
      </View>
    ),
  };

  /**
   * Function for navigating to a screen in the application.
   */
  const navigateToScreen = useCallback((screen) => {
    props.navigation.navigate(screen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Effect for navigating to a set screen when authentication is completed/resolved
   */
  useFocusEffect(
    useCallback(() => {
      const handleNavigateToScreen = async () => {
        if (isAuthenticated) {
          navigateToScreen('Start');
        }
      };
      handleNavigateToScreen();
    }, [isAuthenticated, navigateToScreen])
  );

  /**
   * Effect for showing notification if an error occurs
   */
  useEffect(() => {
    if (isRejected && error?.message) {
      showNotification(error.message, '', 'error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  /**
   * Handles the personal number input field changes and updates state.
   */
  const handlePersonalNumber = (value) => {
    setPersonalNumber(sanitizePin(value));
  };

  /**
   * Handles the submission of the login form.
   */
  const handleLogin = async (authOnExternalDevice = false) => {
    // Validate personal number if authentication is chosen to be triggered on an external device
    if (authOnExternalDevice) {
      if (personalNumber.length <= 0) {
        return;
      }

      if (!validatePin(personalNumber)) {
        Alert.alert('Felaktigt personnummer. Ange format: ååååmmddxxxx.');
        return;
      }

      await handleAuth(personalNumber, false);
      return;
    }
    // Send empty personal number to use the personal number from users BankID app
    await handleAuth(undefined, true);
  };

  return (
    <FlexView>
      <FlexView>
        <SafeAreaViewTop edges={['top', 'right', 'left']}>
          <StatusBar barStyle="dark-content" backgroundColor={theme.colors.neutrals[6]} />
          <Header>
            <Logo source={SLIDES.STADSVAPEN_PNG} resizeMode="contain" />
            <Title>Mitt Helsingborg</Title>
            <Separator />
            <LoginHeading>Välkommen!</LoginHeading>
            <ContentText>Till en enklare och säkrare kontakt med Helsingborgs Stad.</ContentText>
          </Header>

          {(isLoading || isResolved) && (
            <Form>
              <AuthLoading
                colorSchema="blue"
                isResolved={isResolved}
                cancelSignIn={() => handleCancelOrder()}
                isBankidInstalled
              />
            </Form>
          )}

          {(isIdle || isRejected) && (
            <Form>
              <Button z={0} size="large" block onClick={() => handleLogin()}>
                <Text>Logga in med Mobilt BankID</Text>
              </Button>
              <Link onPress={toggleLoginModal}>Fler alternativ</Link>
            </Form>
          )}

          <Footer>
            <FooterText>
              När du använder tjänsten Mitt Helsingborg godkänner du vårt{' '}
              <ParagraphLink onPress={toggleAgreementModal}>användaravtal</ParagraphLink> och att du
              har tagit del av hur vi hanterar dina{' '}
              <ParagraphLink
                onPress={() =>
                  Linking.openURL(
                    'https://helsingborg.se/toppmeny/om-webbplatsen/sa-har-behandlar-vi-dina-personuppgifter/'
                  )
                }
              >
                personuppgifter
              </ParagraphLink>
              .
            </FooterText>
          </Footer>
        </SafeAreaViewTop>
      </FlexView>

      <LoginModal visible={loginModalVisible} hide={toggleLoginModal}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          extraScrollHeight={50}
        >
          <CloseModalButton onClose={toggleLoginModal} primary={false} showBackButton={false} />
          <FlexView>
            <Header>
              <ModalHeading>Logga in med BankID på en annan enhet</ModalHeading>
              <ContentText>
                Öppna Mobilt BankID eller BankID på din andra enhet innan du trycker på logga in här
                nedaför.
              </ContentText>
            </Header>

            {(isLoading || isResolved) && (
              <Form>
                <AuthLoading
                  colorSchema="blue"
                  isResolved={isResolved}
                  cancelSignIn={() => handleCancelOrder()}
                  isBankidInstalled={false}
                />
              </Form>
            )}

            {(isIdle || isRejected) && (
              <Form>
                <Label strong>PERSONNUMMER</Label>
                <LoginInput
                  colorSchema="neutral"
                  returnKeyType={null}
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
                    handleLogin(true);
                  }}
                >
                  <Text>Logga in</Text>
                </Button>

                <Link
                  onPress={() => {
                    Linking.openURL('https://support.bankid.com/sv/bankid/mobilt-bankid');
                  }}
                >
                  Läs mer om hur du skaffar mobilt BankID
                </Link>
              </Form>
            )}
          </FlexView>
        </KeyboardAwareScrollView>
      </LoginModal>

      <LoginModal visible={agreementModalVisible} hide={toggleAgreementModal}>
        <KeyboardAwareScrollView>
          <CloseModalButton onClose={toggleAgreementModal} primary={false} showBackButton={false} />
          <UserAgreementForm>
            <MarkdownConstructor rules={userAgreementMarkdownRules} rawText={userAgreementText} />
          </UserAgreementForm>
          <UserAgreementFooter>
            <Button z={0} block onClick={toggleAgreementModal}>
              <Text>Återvänd till inloggning</Text>
            </Button>
          </UserAgreementFooter>
        </KeyboardAwareScrollView>
      </LoginModal>
    </FlexView>
  );
}

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export default LoginScreen;
