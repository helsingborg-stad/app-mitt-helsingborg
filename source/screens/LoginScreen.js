import PropTypes from 'prop-types';
import React, { useState, useContext, useCallback } from 'react';
import { Alert, Keyboard, Linking } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components/native';
import AuthLoading from 'app/components/molecules/AuthLoading';
import ScreenWrapper from 'app/components/molecules/ScreenWrapper';
import { ValidationHelper } from 'app/helpers';
import Button from 'app/components/atoms/Button';
import Text from 'app/components/atoms/Text';
import Heading from 'app/components/atoms/Heading';
import Input from 'app/components/atoms/Input';
import { SLIDES } from 'app/assets/images';
import AuthContext from '../store/AuthContext';

const { sanitizePin, validatePin } = ValidationHelper;

const Logo = styled.Image`
  height: 200px;
  width: auto;
`;

const LoginScreenWrapper = styled(ScreenWrapper)`
  padding: 16px;
  background-color: #f5f5f5;
`;

const Link = styled(Text)`
  text-decoration: underline;
  font-size: 16px;
  text-align: center;
  margin-top: 16px;
  margin-bottom: 8px;
`;

const LoginSafeAreaView = styled.SafeAreaView`
  flex: 1;
  align-items: stretch;
`;

const LoginHeader = styled.View`
  text-align: center;
  flex: 1;
  justify-content: center;
`;

const LoginBody = styled.View`
  flex: 1;
  justify-content: flex-end;
`;

const LoginForm = styled.View`
  flex-grow: 0;
`;

const LoginFormField = styled.View`
  margin-bottom: 16px;
`;
const LoginFormHeader = styled.View`
  margin-bottom: 32px;
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

  /**
   * Handles the personal number input field changes and updates state.
   */
  const handlePersonalNumber = value => {
    setPersonalNumber(sanitizePin(value));
  };

  /**
   * Handles the submission of the login form.
   */
  const handleSubmit = async () => {
    if (personalNumber.length <= 0) {
      return;
    }

    if (!validatePin(personalNumber)) {
      Alert.alert('Felaktigt personnummer. Ange format ÅÅÅÅMMDDXXXX.');
      return;
    }

    await handleAuth(personalNumber);
  };

  if (isLoading) {
    return (
      <LoginScreenWrapper>
        <AuthLoading
          cancelSignIn={() => handleCancelOrder()}
          isBankidInstalled={isBankidInstalled}
        />
      </LoginScreenWrapper>
    );
  }

  return (
    <LoginSafeAreaView behavior="padding" enabled>
      <LoginScreenWrapper>
        <LoginHeader>
          <Logo source={SLIDES.STADSVAPEN_PNG} resizeMode="contain" />
        </LoginHeader>
        <LoginBody>
          <LoginForm>
            <LoginFormHeader>
              <Heading>Logga in</Heading>
            </LoginFormHeader>

            {/* TODO: Fix better error messages */}
            {isRejected && (
              <Text style={{ color: 'red', paddingBottom: 12 }}>{error && error.message}</Text>
            )}

            <LoginFormField>
              <Input
                placeholder="ÅÅÅÅMMDDXXXX"
                value={personalNumber}
                onChangeText={handlePersonalNumber}
                keyboardType="number-pad"
                returnKeyType="done"
                maxLength={12}
                onSubmitEditing={handleSubmit}
                center
              />
            </LoginFormField>

            <LoginFormField>
              <Button color="purpleLight" block onClick={handleSubmit}>
                <Text>Logga in med mobilt BankID</Text>
              </Button>
            </LoginFormField>

            <LoginFormField>
              <Link
                onPress={() => {
                  Linking.openURL('https://support.bankid.com/sv/bankid/mobilt-bankid').catch(() =>
                    console.log('Couldnt open url')
                  );
                }}
              >
                Läs mer om hur du skaffar mobilt BankID
              </Link>
            </LoginFormField>
          </LoginForm>
        </LoginBody>
      </LoginScreenWrapper>
    </LoginSafeAreaView>
  );
}

LoginScreen.propTypes = {
  navigation: PropTypes.object,
};

export default LoginScreen;
