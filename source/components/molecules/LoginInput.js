import React, { Component } from 'react';
import { Alert, ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { sanitizePin, validatePin } from "../../helpers/ValidationHelper";
import { withNavigation } from 'react-navigation';

import withAuthentication from '../organisms/withAuthentication';
import Button from '../atoms/ButtonDeprecated';
import ChatForm from './ChatForm';


class LoginInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            personalNumberInput: ''
        };
    }

    /**
     * On login click handler
     */
    loginClicked = () => {
        this.props.addMessages(
            [
                {
                    type: 'string',
                    modifiers: ['user'],
                    value: "Logga in med Mobilt BankID"
                },
                {
                    type: 'string',
                    modifiers: ['automated'],
                    value: "Eftersom det är första gången du loggar in behöver du ange ditt personnummer"
                },
            ]
        );

        this.props.setActions(
            [
                {
                    type: 'separator',
                    value: "Eller lär dig mer om Mitt Helsingborg"
                },
            ]
        );
    }

    /**
     * Sanitize and save personal identity number to state
     * @param {string} personalNumber
     */
    setPin(personalNumber) {
        personalNumber = sanitizePin(personalNumber);

        this.setState({
            personalNumberInput: personalNumber
        });
    }

    /**
     * Authenticate user and navigate on success
     */
    authenticateUser = async (personalNumber) => {
        if (!personalNumber) {
            Alert.alert('Personnummer saknas');
            return;
        }

        if (!validatePin(personalNumber)) {
            Alert.alert('Felaktigt personnummer. Ange format ÅÅÅÅMMDDXXXX.');
            return;
        }

        try {
            const { loginUser } = this.props.authentication;
            await loginUser(personalNumber);
            this.props.navigation.navigate('App');
        } catch (e) {
            if (e.message !== 'cancelled') {
                Alert.alert(e.message);
            }
        }
    };

    render() {
        const { personalNumberInput } = this.state;
        const { isLoading, cancelLogin, user, isBankidInstalled } = this.props.authentication;

        return (
            <View style={{ borderTopColor: 'gainsboro', borderTopWidth: 1, }}>
                {/* Loading */}
                {isLoading &&
                    <View style={{ padding: 16 }}>
                        <ActivityIndicator size="large" color="slategray" />
                        {!isBankidInstalled &&
                            <Text style={styles.infoText}>Väntar på att BankID ska startas på en annan enhet</Text>
                        }
                        <Button
                            onClick={cancelLogin}
                            value="Avbryt"
                        />
                    </View>
                }

                {/* First time users */}
                {!isLoading && (user.personalNumber === 'undefined' || !user.personalNumber) &&
                    <ChatForm
                        autoFocus={true}
                        keyboardType='number-pad'
                        maxLength={12}
                        submitText={'Logga in'}
                        placeholder={'Ange ditt personnummer'}
                        inputValue={personalNumberInput}
                        changeHandler={(value) => this.setPin(value)}
                        submitHandler={() => this.authenticateUser(personalNumberInput)}
                    />
                }

                {/* Returning users */}
                {!isLoading && (user.personalNumber !== 'undefined' && user.personalNumber) &&
                    <View style={{ padding: 16 }}>
                        <Button
                            onClick={() => this.authenticateUser(user.personalNumber)}
                            value="Logga in med Mobilt BankID"
                        />
                    </View>
                }
            </View>
        );
    }
}

export default withNavigation(withAuthentication(LoginInput));

const styles = StyleSheet.create({
    infoText: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 24,
        marginBottom: 24
    }
});
