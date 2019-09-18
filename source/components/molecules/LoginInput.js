import React, { Component } from 'react';
import { Alert, TouchableOpacity, ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import StorageService from '../../services/StorageService';
import Auth from '../../helpers/AuthHelper';
import { authorize, cancelRequest, resetCancel } from "../../services/UserService";
import { canOpenUrl } from "../../helpers/LinkHelper";
import { sanitizePin, validatePin } from "../../helpers/ValidationHelper";
import { withNavigation } from 'react-navigation';
import { Button, ChatForm } from '../Components';

const USERKEY = 'user';

class LoginInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: {},
            isBankidInstalled: false,
            isLoading: false,
            personalNumberInput: ''
        };
    }

    componentDidMount() {
        this.setUserAsync();
        this.isBankidInstalled();
    }

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
     * Get user from async storage and add to state
     */
    setUserAsync = async () => {
        try {
            const user = await StorageService.getData(USERKEY);
            if (typeof user !== 'undefined' && user !== null) {
                this.setState({ user });
                // Login the user automatically
                this.authenticateUser(user.personalNumber);
            }
        } catch (error) {
            console.log("Something went wrong", error);
        }
    };

    /**
     * Check if BankID app is installed on this machine
     */
    isBankidInstalled = async () => {
        const isBankidInstalled = await canOpenUrl('bankid:///');
        console.log("isBankidInstalled", isBankidInstalled);

        if (isBankidInstalled) {
            this.setState({ isBankidInstalled: true });
        }
    };

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
     * Make authenticate request and log in user
     */
    authenticateUser = async (personalNumber) => {
        this.setState({ isLoading: true });

        if (!personalNumber) {
            this.displayError('Personnummer saknas');
            return;
        }

        if (!validatePin(personalNumber)) {
            this.displayError('Felaktigt personnummer. Ange format ÅÅÅÅMMDDXXXX.');
            return;
        }

        try {
            const authResponse = await authorize(personalNumber);
            if (authResponse.ok === true) {
                console.log("authResponse success", authResponse);
                const { user, accessToken } = authResponse.data;
                try {
                    console.log("Try login");
                    console.log("user", user);
                    console.log("accessToken", accessToken);
                    const stuff = await Auth.logIn(user, accessToken);
                    console.log("stuff", stuff);
                    this.props.navigation.navigate('App');
                } catch (error) {
                    throw "Login failed";
                }

            } else {
                console.log("authResponse failed", authResponse);
                throw authResponse.data;
            }

        } catch (error) {
            // TODO: Add dynamic error messages
            console.log("authResponse error", error);

            this.setState({ isLoading: false });

            if (error !== 'cancelled') {
                this.displayError(error);
            }
        }

        // Reset cancel variable when done
        resetCancel();
    };

    /**
     * Display error notice
     */
    displayError = message => {
        this.setState({ isLoading: false });
        Alert.alert(message);
    };

    /**
     * Cancel BankID login request
     */
    cancelLogin = async () => {
        try {
            cancelRequest();
        } catch (error) {
            console.log(error);
        } finally {
            // Clears access token and reset state
            Auth.logOut();
            this.setState({ isLoading: false });
        }
    };

    /**
     * Remove user from state, to be able to login as another user
     */
    resetUser = async () => {
        this.setState({ user: {} });
    };

    render() {
        const { user, isLoading, personalNumberInput, isBankidInstalled } = this.state;

        return (
            <View>
                {/* Loading */}
                {isLoading &&
                    <View style={{ padding: 16 }}>
                        <ActivityIndicator size="large" color="slategray" />
                        {!isBankidInstalled &&
                            <Text style={styles.infoText}>Väntar på att BankID ska startas på en annan enhet</Text>
                        }
                        <Button
                            onClick={this.cancelLogin}
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

export default withNavigation(LoginInput);

const styles = StyleSheet.create({
    paper: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 7,
        shadowOpacity: 0.2,
        shadowRadius: 2,
        shadowColor: '#000',
        shadowOffset: { height: 5, width: 0 },
    },
    container: {
        flex: 1,
        alignItems: 'stretch',
        padding: 16,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginContainer: {
        flex: 0,
        width: '100%',
        marginBottom: 30
    },
    loginFooter: {
        marginTop: 42,
        marginBottom: 26,
        alignItems: 'center',
    },
    button: {
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: '#007AFF',
        borderRadius: 7,
    },
    buttonDisabled: {
        backgroundColor: '#E5E5EA',
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    buttonTextDisabled: {
        color: '#C7C7CC',
    },
    header: {
        fontWeight: 'bold',
        fontSize: 35,
        textAlign: 'center',
    },
    infoText: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 24,
        marginBottom: 24
    },
    label: {
        fontSize: 15,
        marginBottom: 8,
    },
    inputField: {
        height: 40,
        borderColor: 'transparent',
        borderBottomColor: '#D3D3D3',
        borderWidth: 0.5,
        marginBottom: 24,
        color: '#555',
    },
});
