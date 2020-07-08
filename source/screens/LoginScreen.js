import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, Keyboard, Linking } from 'react-native';
import env from 'react-native-config';
import styled from 'styled-components/native';
import { AuthLoading, ScreenWrapper } from 'app/components/molecules';
import { ValidationHelper, UrlHelper } from 'app/helpers';
import { Button, Text, Heading, Input } from 'app/components/atoms';
import { SLIDES } from 'app/assets/images';
import AuthContext from '../store/AuthContext';

const { sanitizePin, validatePin } = ValidationHelper;
const { canOpenUrl } = UrlHelper;

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

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideLogo: false,
      personalNumberInput: '',
      isBankidInstalled: false,
    };
  }

  componentDidMount() {
    this.isBankidInstalled();

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

  /**
   * Check if BankID app is installed on this machine
   */
  isBankidInstalled = async () => {
    const isInstalled = await canOpenUrl('bankid:///');

    if (isInstalled) {
      this.setState({ isBankidInstalled: true });
    }
  };

  changeHandler = value => {
    this.setState({
      personalNumberInput: sanitizePin(value),
    });
  };

  signInNavigate = () => {
    const { authStatus } = this.context;
    const {
      navigation: { navigate },
    } = this.props;

    if (authStatus === 'resolved') {
      navigate('Chat');
    }
  };

  submitHandler = async () => {
    const { signIn } = this.context;
    const { personalNumberInput, isBankidInstalled } = this.state;

    // Use external mobile bankid app if app is not installed or set to dev mode
    const useExternalBankId = !isBankidInstalled || env.APP_ENV === 'development';

    if (useExternalBankId) {
      // Validate personal number input
      if (personalNumberInput.length <= 0) {
        return;
      }

      if (!validatePin(personalNumberInput)) {
        Alert.alert('Felaktigt personnummer. Ange format ÅÅÅÅMMDDXXXX.');
        return;
      }

      await signIn(personalNumberInput);
    } else {
      await signIn(undefined);
    }

    this.signInNavigate();
  };

  render() {
    const { authStatus, cancelSignIn, error } = this.context;
    const { personalNumberInput, hideLogo, isBankidInstalled } = this.state;
    const useExternalBankId = !isBankidInstalled || env.APP_ENV === 'development';

    if (authStatus === 'pending') {
      return (
        <LoginScreenWrapper>
          <AuthLoading cancelSignIn={() => cancelSignIn()} isBankidInstalled={isBankidInstalled} />
        </LoginScreenWrapper>
      );
    }

    return (
<<<<<<< HEAD
      <LoginScreenWrapper>
        <LoginKeyboardAvoidingView enabled>
=======
      <LoginSafeAreaView behavior="padding" enabled>
        <LoginScreenWrapper>
>>>>>>> 91b1370... Add button that opens a sub-form, first version.
          <LoginHeader>
            {hideLogo ? null : <Logo source={SLIDES.STADSVAPEN_PNG} resizeMode="contain" />}
          </LoginHeader>
          <LoginBody>
            <LoginForm>
              <LoginFormHeader>
                <Heading>Logga in</Heading>
              </LoginFormHeader>

              {/* TODO: Fix better error messages */}
              {authStatus === 'rejected' && (
                <Text style={{ color: 'red', paddingBottom: 12 }}>{error.message}</Text>
              )}

              {useExternalBankId && (
                <LoginFormField>
                  <Input
                    placeholder="ÅÅÅÅMMDDXXXX"
                    value={personalNumberInput}
                    onChangeText={this.changeHandler}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    maxLength={12}
                    onSubmitEditing={() => this.submitHandler()}
                    center
                  />
                </LoginFormField>
              )}
              <LoginFormField>
                <Button
                  disabled={authStatus === 'canceled'}
                  color="purpleLight"
                  block
                  onClick={() => this.submitHandler()}
                >
                  <Text>Logga in med mobilt BankID</Text>
                </Button>
              </LoginFormField>

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
        </LoginScreenWrapper>
      </LoginSafeAreaView>
    );
  }
}

LoginScreen.propTypes = {
  navigation: PropTypes.object,
};

LoginScreen.contextType = AuthContext;

export default LoginScreen;
