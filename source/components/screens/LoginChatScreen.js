import React, { Component } from 'react';
import { KeyboardAvoidingView, Alert, TouchableOpacity, ActivityIndicator, StyleSheet, Text, View, TextInput, Linking, Button, FlatList, SafeAreaView } from 'react-native';
import StorageService from '../../services/StorageService';
import Auth from '../../helpers/AuthHelper';
import { authorize, bypassBankid, cancelRequest, resetCancel } from "../../services/UserService";
import { canOpenUrl } from "../../helpers/LinkHelper";
import { sanitizePin, validatePin } from "../../helpers/ValidationHelper";
import ConversationList from '../login/ConversationList';

const USERKEY = 'user';

const AUTOMATED_MESSAGES = [
    {
        type: 'string',
        size: 'xl',
        value: "Hej!",
    },
    {
        type: 'string',
        size: 'lg',
        value: "Välkommen till Mitt Helsingborg!"
    },
    {
        type: 'string',
        size: 'md',
        value: "Jag heter Sally!"
    },
    {
        type: 'separator',
        size: 'sm',
        value: "Hur vill du fortsätta?"
    },
    {
        type: 'component',
        size: 'md',
        value: "moreInfo"
    },
    {
        type: 'component',
        size: 'md',
        value: "login"
    },
]

class LoginChatScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            user: {},
            isBankidInstalled: false,
            validPin: false,
            isLoading: false,
            personalNumberInput: ''
        };
    }

    componentDidMount() {
        this.setUserAsync();
        this.isBankidInstalled();
        this.initConversation();
    }

    initConversation = () => {
        for (let i = 0; i < AUTOMATED_MESSAGES.length; i++) {
            setTimeout(() => {
                let { messages } = this.state;
                messages.push(AUTOMATED_MESSAGES[i]);
                this.setState({ messages })
            }, 300 * i);
        }
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

        // TODO: For testing only, remove me later
        if (personalNumber === '201111111111') {
            bypassBankid(personalNumber).then(res => {
                const { user } = res.data;
                Auth.logIn(
                    user,
                    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImp0aSI6IjFlZDcyYzJjLWQ5OGUtNGZjMC04ZGY2LWY5NjRkOTYxMTVjYSIsImlhdCI6MTU2Mjc0NzM2NiwiZXhwIjoxNTYyNzUwOTc0fQ.iwmUMm51j-j2BYui9v9371DkY5LwLGATWn4LepVxmNk' // fake token
                )
                    .then(() => {
                        this.props.navigation.navigate('App');
                    }).catch(() => {
                        this.displayError('Login failed');
                    });

            }).catch(error => console.log(error));

            return;
        }

        try {
            const authResponse = await authorize(personalNumber);
            if (authResponse.ok === true) {
                console.log("authResponse success", authResponse);
                const { user, accessToken } = authResponse.data;
                try {
                    console.log("Try login");
                    await Auth.logIn(user, accessToken);
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
        const { user, isLoading, validPin, personalNumberInput, isBankidInstalled, messages } = this.state;

        return (
            <SafeAreaView style={{ flex: 1 }}>
                {isLoading === false ? (
                    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>

                        {/* List conversation items */}
                        <View style={styles.content}>
                            <ConversationList
                                listItems={messages} />
                        </View>

                    </KeyboardAvoidingView >
                ) : (
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
                    )
                }
            </SafeAreaView>
        );
    }
}

export default LoginChatScreen;

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
        //alignItems: 'center',
        //justifyContent: 'center',
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
    inputField: {
        height: 40,
        borderColor: 'transparent',
        borderBottomColor: '#D3D3D3',
        borderWidth: 0.5,
        marginBottom: 24,
        color: '#555',
    },
});


