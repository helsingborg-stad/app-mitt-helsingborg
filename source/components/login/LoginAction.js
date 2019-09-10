import React, { Component } from 'react';
import { KeyboardAvoidingView, Alert, TouchableOpacity, ActivityIndicator, StyleSheet, Text, View, TextInput, Linking, Button, FlatList } from 'react-native';
import StorageService from '../../services/StorageService';
import Auth from '../../helpers/AuthHelper';
import { authorize, bypassBankid, cancelRequest, resetCancel } from "../../services/UserService";
import { canOpenUrl } from "../../helpers/LinkHelper";
import { sanitizePin, validatePin } from "../../helpers/ValidationHelper";
import { withNavigation } from 'react-navigation';

const USERKEY = 'user';

class LoginAction extends Component {

    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            serviceId: 1,
            user: {},
            isBankidInstalled: false,
            validPin: false,
            isLoading: false,
            personalNumberInput: ''
        };
    }

    componentDidMount() {
        //this.setUserAsync();
        this.isBankidInstalled();
    }

    /**
     * Get user from async storage and add to state
     */
    setUserAsync = async () => {
        try {
            const user = await StorageService.getData(USERKEY);
            if (typeof user !== 'undefined' && user !== null) {
                this.setState({ user });
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
            validPin: validatePin(personalNumber),
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
     * Check PIN (Personal identity number)
     */
    checkPin = () => {
        const { validPin } = this.state;
        if (!validPin) {
            this.displayError('Felaktigt personnummer. Ange format ÅÅÅÅMMDDXXXX.');
        }
    };

    /**
     * Remove user from state, to be able to login as another user
     */
    resetUser = async () => {
        this.setState({ user: {} });
    };

    render() {
        const { user, isLoading, validPin, personalNumberInput, isBankidInstalled } = this.state;

        return (
            <View
                style={styles.loginContainer}
                testID={"ViewLogin"}
            >

                {/* Is loading */}
                {isLoading &&
                    <View style={styles.container}>
                        <View style={styles.content}>
                            <ActivityIndicator size="large" color="slategray" />
                            {!isBankidInstalled &&
                                <Text style={styles.infoText}>Väntar på att BankID ska startas på en annan enhet</Text>
                            }
                        </View>
                        <View style={styles.loginContainer}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={this.cancelLogin}
                                underlayColor='#fff'>
                                <Text style={styles.buttonText}>Avbryt</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }

                {/* First time user */}
                {!isLoading && (user.personalNumber === 'undefined' || !user.personalNumber) &&
                    <TouchableOpacity
                        style={[styles.button]}
                        //style={[styles.button, !validPin ? styles.buttonDisabled : '']}
                        onPress={() => this.authenticateUser(personalNumberInput)}
                        underlayColor='#fff'
                    //disabled={!validPin}
                    >
                        <Text
                            style={styles.buttonText}
                        //style={[styles.buttonText, !validPin ? styles.buttonTextDisabled : '']}
                        >
                            Logga in med Mobilt BankID
                        </Text>
                    </TouchableOpacity>
                }

                {/* Returnung user */}
                {!isLoading && user.personalNumber !== 'undefined' && user.personalNumber &&
                    <>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => this.authenticateUser(user.personalNumber)}
                            underlayColor='#fff'
                        >
                            <Text
                                style={styles.buttonText}
                                accessible={true}
                                testID={"LoginButton"}
                            >Logga in</Text>
                        </TouchableOpacity>

                        <View
                            style={styles.loginFooter}
                            testID={"ChangeLogInUser"}
                        >

                        </View>
                    </>
                }


            </View>
        );
    }
}

export default withNavigation(LoginAction);

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
        borderWidth: 1,
        borderColor: 'magenta',
        flex: 1,
        alignItems: 'stretch',
        padding: 16,
    },
    content: {
        borderWidth: 1,
        borderColor: 'blue',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginFooter: {
        marginTop: 42,
        marginBottom: 26,
        alignItems: 'center',
    },
    button: {
        marginBottom: 15,
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 7,
        shadowOpacity: 0.3,
        shadowRadius: 7,
        shadowColor: '#000',
        shadowOffset: { height: 1, width: 0 },
    },
    buttonPrimary: {
        backgroundColor: '#007AFF',
    },
    buttonDisabled: {
        backgroundColor: '#E5E5EA',
    },
    buttonText: {
        fontSize: 18,
        color: '#005C86',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    buttonPrimaryText: {
        color: '#fff',
    },
    buttonTextDisabled: {
        color: '#C7C7CC',
    },
    infoText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 24,
        marginBottom: 24
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        height: 40,
        borderColor: '#D3D3D3',
        borderWidth: 0.5,
        marginBottom: 24,
        color: '#555',
    },
});
