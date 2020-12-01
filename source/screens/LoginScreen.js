import PropTypes from 'prop-types';
import React, { useState, useContext, useCallback, useEffect } from 'react';
import { Alert, Keyboard, Linking } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components/native';
import AuthLoading from 'app/components/molecules/AuthLoading';
import ScreenWrapper from 'app/components/molecules/ScreenWrapper';
import { ValidationHelper } from 'app/helpers';
import Button from 'app/components/atoms/Button';
import Text from 'app/components/atoms/Text';
import Modal from 'app/components/molecules/Modal';
import Heading from 'app/components/atoms/Heading';
import Input from 'app/components/atoms/Input';
import { SLIDES } from 'app/assets/images';
import BackNavigation from 'app/components/molecules/BackNavigation';
import AuthContext from '../store/AuthContext';
import { useNotification } from '../store/NotificationContext';

const { sanitizePin, validatePin } = ValidationHelper;

const Link = styled(Text)`
  font-size: ${props => props.theme.fontSizes[3]}px;
  text-align: center;
  margin-top: 16px;
  margin-bottom: 8px;
`;

const LoginSafeAreaView = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.colors.neutrals[6]};
`;

const LoginBody = styled.View`
  flex-grow: 1;
  flex: 1;
  flex-direction: column;
`;

const LoginHeader = styled.View`
  justify-content: center;
  flex: 4;
  padding-left: 40px;
  padding-right: 40px;
`;

const LoginForm = styled.View`
  flex: 1;
  padding-left: 40px;
  padding-right: 40px;
`;

const LoginFooter = styled.View`
  flex: 1;
  padding: 24px 40px 24px 40px;
  border-top-color: ${props => props.theme.border.default};
  border-top-width: 1px;
  background-color: ${props => props.theme.colors.neutrals[5]};
`;

const Logo = styled.Image`
  width: 35px;
  height: 70px;
  margin-bottom: 24px;
`;

const Title = styled(Heading)`
  font-size: ${props => props.theme.fontSizes[3]}px;
  color: ${props => props.theme.colors.primary.red[0]};
`;

const LoginHeading = styled(Heading)`
  font-size: ${props => props.theme.fontSizes[10]}px;
  font-weight: bold;
  line-height: 40;
  color: ${props => props.theme.colors.primary.blue[0]};
`;

const Separator = styled.View`
  border-radius: 40px;
  height: 2px;
  width: 25px;
  opacity: 0.2;
  background-color: ${props => props.theme.colors.neutrals[0]};
  margin-bottom: 16px;
`;

const LoginModal = styled(Modal)`
  background-color: white;
`;

const ModalScreenWrapper = styled.View`
  padding-left: 40px;
  padding-right: 40px;
`;

const CloseModalButton = styled(BackNavigation)`
  padding: 16px;
`;

const FooterText = styled(Text)`
  font-style: italic;
  color: ${props => props.theme.colors.primary.blue[0]};
`;

const FooterLink = styled(Link)`
  font-style: italic;
  font-size: ${props => props.theme.fontSizes[2]}px;
  font-weight: bold;
  text-decoration: underline;
  color: ${props => props.theme.colors.primary.blue[0]};
`;

function LoginScreen(props) {
  const {
    isAuthenticated,
    handleAuth,
    isLoading,
    handleCancelOrder,
    isBankidInstalled,
    isRejected,
    error,
  } = useContext(AuthContext);

  const showNotification = useNotification();

  const [modalVisible, setModalVisible] = useState(false);
  const [personalNumber, setPersonalNumber] = useState('');

  /**
   * Function for navigating to a screen in the application.
   */
  const navigateToScreen = useCallback(screen => {
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

  useEffect(() => {
    if (isRejected && error?.message) {
      showNotification(error.message, '', 'error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  /**
   * Handles the personal number input field changes and updates state.
   */
  const handlePersonalNumber = value => {
    setPersonalNumber(sanitizePin(value));
  };

  /**
   * Handles the submission of the login form.
   */
  const handleSubmit = async (externalDevice = false) => {
    if (externalDevice) {
      if (personalNumber.length <= 0) {
        return;
      }

      if (!validatePin(personalNumber)) {
        Alert.alert('Felaktigt personnummer. Ange format: ååååmmddxxxx.');
        return;
      }

      await handleAuth(personalNumber);
    }

    await handleAuth();
  };

  return (
    <LoginSafeAreaView behavior="padding" enabled>
      <LoginBody>
        <LoginHeader>
          <Logo source={SLIDES.STADSVAPEN_PNG} resizeMode="contain" />
          <Title>Mitt Helsingborg</Title>
          <Separator />
          <LoginHeading>Välkommen!</LoginHeading>
          <Text>Till en enklare och säkrare kontakt med Helsingborgs Stad.</Text>
        </LoginHeader>

        <LoginForm>
          {isLoading ? (
            <AuthLoading cancelSignIn={() => handleCancelOrder()} isBankidInstalled />
          ) : (
            <>
              <Button block onClick={() => handleSubmit(false)}>
                <Text>Logga in med Mobilt BankID</Text>
              </Button>

              <Link onPress={() => setModalVisible(true)}>Fler alternativ</Link>
            </>
          )}
        </LoginForm>

        <LoginFooter>
          <FooterText>
            När du använder tjänsten Mitt Helsingborg godkänner du vårt{' '}
            <FooterLink
              onPress={() =>
                Linking.openURL(
                  'https://helsingborg.se/toppmeny/om-webbplatsen/sa-har-behandlar-vi-dina-personuppgifter/'
                ).catch(() => console.log('Couldnt open url'))
              }
            >
              användaravtal
            </FooterLink>{' '}
            och att du har tagit del av hur vi hanterar dina{' '}
            <FooterLink
              onPress={() =>
                Linking.openURL(
                  'https://helsingborg.se/toppmeny/om-webbplatsen/sa-har-behandlar-vi-dina-personuppgifter/'
                ).catch(() => console.log('Couldnt open url'))
              }
            >
              personuppgifter
            </FooterLink>
            .
          </FooterText>
        </LoginFooter>
      </LoginBody>

      <LoginModal visible={modalVisible}>
        <CloseModalButton onClose={() => setModalVisible(false)} showBackButton={false} />

        <ModalScreenWrapper>
          <Heading>Logga in med BankID på en annan enhet</Heading>
          <Text italic>
            Öppna Mobilt BankID eller BankID på din andra enhet innan du trycker på logga in här
            nedaför.
          </Text>

          {isLoading ? (
            <AuthLoading cancelSignIn={() => handleCancelOrder()} isBankidInstalled={false} />
          ) : (
            <>
              <Input
                placeholder="ååååmmddxxxx"
                value={personalNumber}
                onChangeText={handlePersonalNumber}
                keyboardType="number-pad"
                returnKeyType="done"
                maxLength={12}
                onSubmitEditing={() => handleSubmit(true)}
                center
              />
              <Button
                block
                onClick={() => {
                  handleSubmit(true);
                }}
              >
                <Text>Logga in</Text>
              </Button>
            </>
          )}
        </ModalScreenWrapper>
      </LoginModal>
    </LoginSafeAreaView>
  );
}

export default LoginScreen;
