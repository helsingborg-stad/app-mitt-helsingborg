import { useFocusEffect } from '@react-navigation/native';
import { SLIDES } from 'app/assets/images';
import Button from 'app/components/atoms/Button';
import Heading from 'app/components/atoms/Heading';
import Input from 'app/components/atoms/Input';
import Text from 'app/components/atoms/Text';
import AuthLoading from 'app/components/molecules/AuthLoading';
import BackNavigation from 'app/components/molecules/BackNavigation';
import Modal from 'app/components/molecules/Modal';
import { ValidationHelper } from 'app/helpers';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Alert, Linking } from 'react-native';
import styled from 'styled-components/native';
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
  flex: 1;
`;

const LoginHeader = styled.View`
  justify-content: center;
  flex: 3;
  padding: 0px 48px 24px 48px;
`;

const LoginForm = styled.View`
  flex: 1;
  padding: 24px 48px 24px 48px;
  justify-content: center;
`;

const LoginFooter = styled.View`
  flex: 1;
  padding: 24px 48px 8px 48px;
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
  font-size: ${props => props.theme.fontSizes[13]}px;
  font-weight: ${props => props.theme.fontWeights[1]};
  line-height: 50px;
  color: ${props => props.theme.colors.primary.blue[0]};
`;

const ModalHeading = styled(Heading)`
  font-size: ${props => props.theme.fontSizes[9]}px;
  font-weight: ${props => props.theme.fontWeights[1]};
  line-height: 40px;
  color: ${props => props.theme.colors.primary.blue[0]};
`;

const LoginText = styled(Text)`
  font-size: ${props => props.theme.fontSizes[4]}px;
  line-height: 28px;
  font-weight: ${props => props.theme.fontWeights[0]};
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
  background-color: ${props => props.theme.colors.neutrals[6]};
`;

const CloseModalButton = styled(BackNavigation)`
  padding: 24px;
`;

const FooterText = styled(Text)`
  font-style: italic;
  color: ${props => props.theme.colors.primary.blue[0]};
`;

const FormLink = styled(Link)`
  color: ${props => props.theme.colors.primary.blue[0]};
`;

const FooterLink = styled(Link)`
  font-style: italic;
  font-size: ${props => props.theme.fontSizes[2]}px;
  font-weight: bold;
  text-decoration-color: ${props => props.theme.colors.primary.blue[0]};
  color: ${props => props.theme.colors.primary.blue[0]};
`;

const LoginInput = styled(Input)`
  margin: 0px;
  margin-bottom: 32px;
`;

const Label = styled(Text)`
  color: ${props => props.theme.colors.primary.blue[0]};
  font-weight: ${props => props.theme.fontWeights[1]};
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

  const [modalVisible, setModalVisible] = useState(false);
  const [personalNumber, setPersonalNumber] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

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
   * Effect for disabling login button if personal number is not required length
   */
  useEffect(() => {
    setIsButtonDisabled(personalNumber.length !== 12);
  }, [isButtonDisabled, personalNumber]);

  /**
   * Handles the personal number input field changes and updates state.
   */
  const handlePersonalNumber = value => {
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
    <LoginSafeAreaView behavior="padding" enabled>
      <LoginBody>
        <LoginHeader>
          <Logo source={SLIDES.STADSVAPEN_PNG} resizeMode="contain" />
          <Title>Mitt Helsingborg</Title>
          <Separator />
          <LoginHeading>Välkommen!</LoginHeading>
          <LoginText>Till en enklare och säkrare kontakt med Helsingborgs Stad.</LoginText>
        </LoginHeader>

        {(isLoading || isResolved) && (
          <LoginForm>
            <AuthLoading
              colorSchema="blue"
              isResolved={isResolved}
              cancelSignIn={() => handleCancelOrder()}
              isBankidInstalled
            />
          </LoginForm>
        )}

        {(isIdle || isRejected) && (
          <LoginForm>
            <Button size="large" block onClick={() => handleLogin()}>
              <Text>Logga in med Mobilt BankID</Text>
            </Button>
            <FormLink onPress={() => setModalVisible(true)}>Fler alternativ</FormLink>
          </LoginForm>
        )}

        <LoginFooter>
          <FooterText>
            När du använder tjänsten Mitt Helsingborg godkänner du vårt{' '}
            <FooterLink
              onPress={() =>
                Linking.openURL(
                  'https://helsingborg.se/toppmeny/om-webbplatsen/sa-har-behandlar-vi-dina-personuppgifter/'
                )
              }
            >
              användaravtal
            </FooterLink>{' '}
            och att du har tagit del av hur vi hanterar dina{' '}
            <FooterLink
              onPress={() =>
                Linking.openURL(
                  'https://helsingborg.se/toppmeny/om-webbplatsen/sa-har-behandlar-vi-dina-personuppgifter/'
                )
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
        <LoginBody>
          <LoginHeader>
            <ModalHeading>Logga in med BankID på en annan enhet</ModalHeading>
            <LoginText>
              Öppna Mobilt BankID eller BankID på din andra enhet innan du trycker på logga in här
              nedaför.
            </LoginText>
          </LoginHeader>

          {(isLoading || isResolved) && (
            <LoginForm>
              <AuthLoading
                colorSchema="blue"
                isResolved={isResolved}
                cancelSignIn={() => handleCancelOrder()}
                isBankidInstalled={false}
              />
            </LoginForm>
          )}

          {(isIdle || isRejected) && (
            <LoginForm>
              <Label>PERSONNUMMER</Label>
              <LoginInput
                placeholder="ååååmmddxxxx"
                value={personalNumber}
                onChangeText={handlePersonalNumber}
                keyboardType="number-pad"
                maxLength={12}
                onSubmitEditing={() => handleLogin(true)}
                center
              />
              <Button
                disabled={isButtonDisabled}
                size="large"
                block
                onClick={() => {
                  handleLogin(true);
                }}
              >
                <Text>Logga in</Text>
              </Button>

              <FormLink
                onPress={() => {
                  Linking.openURL('https://support.bankid.com/sv/bankid/mobilt-bankid');
                }}
              >
                Läs mer om hur du skaffar mobilt BankID
              </FormLink>
            </LoginForm>
          )}
        </LoginBody>
      </LoginModal>
    </LoginSafeAreaView>
  );
}

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export default LoginScreen;
