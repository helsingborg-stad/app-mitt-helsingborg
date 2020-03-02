import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, Keyboard, Linking } from 'react-native';
import styled from 'styled-components/native';
import env from 'react-native-config';
import { Button, Text, Heading, Input } from 'app/components/atoms';
import { AuthLoading, ScreenWrapper } from 'app/components/molecules';
import { withAuthentication } from 'app/components/organisms';
import { ValidationHelper } from 'app/helpers';
import HbgLogo from 'app/assets/slides/stadsvapen.png';

console.log('ValidationHelper', ValidationHelper);

const { sanitizePin, validatePin } = ValidationHelper;

const Logo = styled.Image`
  height: 200px;
  width: auto;
`;

const LoginScreenWrapper = styled(ScreenWrapper)`
  background-color: #f5f5f5;
`;

const Link = styled(Text)`
  text-decoration: underline;
  font-size: 16px;
  text-align: center;
  margin-top: 16px;
  margin-bottom: 8px;
`;

const LoginKeyboardAvoidingView = styled.KeyboardAvoidingView`
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

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideLogo: false,
      personalNumberInput: '',
    };
  }

  componentDidMount() {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', () =>
      this.setState({ hideLogo: true })
    );
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', () =>
      this.setState({ hideLogo: false })
    );
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  changeHandler = value => {
    this.setState({
      personalNumberInput: sanitizePin(value),
    });
  };

  submitHandler = () => {
    const { personalNumberInput } = this.state;

    if (personalNumberInput.length <= 0) {
      return;
    }

    if (!validatePin(personalNumberInput)) {
      Alert.alert('Felaktigt personnummer. Ange format ÅÅÅÅMMDDXXXX.');
      return;
    }

    this.authenticateUser(personalNumberInput);
  };

  /**
   * Authenticate user and navigate on success
   */
  authenticateUser = async personalNumber => {
    try {
      const {
        authentication: { loginUser },
        navigation: { navigate },
      } = this.props;
      await loginUser(personalNumber);
      navigate('Chat');
    } catch (e) {
      if (e.message !== 'cancelled') {
        console.info('Error in LoginScreen::authenticateUser', e.message);
      }
    }
  };

  render() {
    const { personalNumberInput, hideLogo } = this.state;
    const {
      authentication: { isLoading, cancelLogin, isBankidInstalled },
    } = this.props;

    if (isLoading) {
      return (
        <LoginScreenWrapper>
          <AuthLoading cancelLogin={cancelLogin} isBankidInstalled={isBankidInstalled} />
        </LoginScreenWrapper>
      );
    }

    return (
      <LoginScreenWrapper>
        <LoginKeyboardAvoidingView behavior="padding" enabled>
          <LoginHeader>
            {hideLogo ? null : <Logo source={HbgLogo} resizeMode="contain" />}
          </LoginHeader>
          <LoginBody>
            <LoginForm>
              <LoginFormHeader>
                <Heading>Logga in</Heading>
              </LoginFormHeader>
              {!isBankidInstalled || env.APP_ENV === 'development' ? (
                <>
                  <LoginFormField>
                    <Input
                      placeholder="ÅÅÅÅMMDDXXXX"
                      value={personalNumberInput}
                      onChangeText={this.changeHandler}
                      keyboardType="number-pad"
                      returnKeyType="done"
                      maxLength={12}
                      onSubmitEditing={this.submitHandler}
                      center
                    />
                  </LoginFormField>
                  <LoginFormField>
                    <Button color="purpleLight" block onClick={this.submitHandler}>
                      <Text>Logga in med mobilt BankID</Text>
                    </Button>
                  </LoginFormField>
                </>
              ) : (
                <LoginFormField>
                  <Button
                    color="purpleLight"
                    block
                    onClick={() => this.authenticateUser(undefined)}
                  >
                    <Text>Logga in med mobilt BankID</Text>
                  </Button>
                </LoginFormField>
              )}

              <LoginFormField>
                <Link
                  onPress={() => {
                    Linking.openURL(
                      'https://support.bankid.com/sv/bankid/mobilt-bankid'
                    ).catch(() => console.log('Couldnt open url'));
                  }}
                >
                  Läs mer om hur du skaffar mobilt BankID
                </Link>
              </LoginFormField>
            </LoginForm>
          </LoginBody>
        </LoginKeyboardAvoidingView>
      </LoginScreenWrapper>
    );
  }
}

LoginScreen.propTypes = {
  navigation: PropTypes.object,
  authentication: PropTypes.object,
};

export default withAuthentication(LoginScreen);
