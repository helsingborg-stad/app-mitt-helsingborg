import React, { Component } from 'react';
import { KeyboardAvoidingView, Alert, TouchableOpacity, ActivityIndicator, StyleSheet, View, TextInput, Linking } from 'react-native';
import { sanitizePin, validatePin } from "../../helpers/ValidationHelper";
import withAuthentication from '../organisms/withAuthentication';
import ScreenWrapper from '../molecules/ScreenWrapper';
import Text from '../atoms/Text';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import styled from 'styled-components/native';
import Heading from '../atoms/Heading';


import AuthLoading from '../molecules/AuthLoading';

class LoginScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            validPin: false,
            personalNumberInput: ''
        };
    }

    changeHandler = value => {
        this.setState({
            personalNumberInput: sanitizePin(value),
            validPin: validatePin(value)
        });
    }

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
    }

    /**
     * Authenticate user and navigate on success
     */
    authenticateUser = async (personalNumber) => {
        try {
            const {loginUser} = this.props.authentication;
            await loginUser(personalNumber);
            this.props.navigation.navigate('Chat');
        } catch (e) {
            if (e.message !== 'cancelled') {
                console.info('Error in LoginScreen::authenticateUser', e.message);
            }
        }
    };

    render() {
        const {validPin, personalNumberInput } = this.state;
        const {isLoading, cancelLogin, resetUser, user, isBankidInstalled} = this.props.authentication;

        if (isLoading) {
            return (
                <ScreenWrapper>
                    <AuthLoading cancelLogin={cancelLogin} isBankidInstalled={isBankidInstalled} />
                </ScreenWrapper>
            )
        }

        return (
            <ScreenWrapper>
                <LoginWrapper behavior="padding" enabled>
                    <LoginHeader>
                        <Heading align={'center'}>Mitt {'\n'}Helsingborg</Heading>
                    </LoginHeader>
                    <LoginBody>
                        <LoginForm>
                            <Heading marginBottom={24} type={'h4'} align={'center'}>Logga in med BankID</Heading>
                            
                            <LoginFormField>
                                <Label>Personnummer</Label>
                                <Input 
                                    placeholder={'ÅÅÅÅMMDDXXXX'}
                                    value={personalNumberInput}
                                    onChangeText={this.changeHandler}
                                    keyboardType='number-pad'
                                    returnKeyType='done'
                                    maxLength={12}
                                    onSubmitEditing={this.submitHandler}
                                />
                            </LoginFormField>

                            <LoginFormField>
                                <Button 
                                    color={'purple'} 
                                    block 
                                    onClick={this.submitHandler}
                                >
                                        <Text>Logga in med mobilt BankID</Text>
                                </Button>
                            </LoginFormField>

                            <LoginFormField>
                                <Link onPress={() => {
                                                    Linking.openURL("https://support.bankid.com/sv/bankid/mobilt-bankid")
                                                        .catch(() => console.log("Couldnt open url"));
                                                }}>Läs mer om hur du skaffar mobilt BankID</Link>
                            </LoginFormField>

                        </LoginForm>
                    </LoginBody>
                </LoginWrapper>
            </ScreenWrapper>
        );
    }
}

const Link = styled(Text)`
    text-decoration: underline;
    font-size: 16px;
    text-align: center;
    margin-top: 16px;
`;

const Label = styled(Text)`
    margin-bottom: 8px;
    font-size: 16px;
`;

const LoginWrapper = styled.KeyboardAvoidingView`
    flex: 1;
    align-items: stretch;
`;

const LoginHeader = styled.View`
    text-align: center;
    flex: 2;
    justify-content: center;
`;

const LoginBody = styled.View`flex: 1; margin-bottom: 192px;`;
const LoginForm = styled.View``;
const LoginFormField = styled.View`margin-bottom: 16px;`;

export default withAuthentication(LoginScreen);