import React, { Component } from 'react';
import { KeyboardAvoidingView, Alert, TouchableOpacity, ActivityIndicator, StyleSheet, Text, View, TextInput, Linking, Button, FlatList } from 'react-native';
import StorageService from '../../services/StorageService';
import Auth from '../../helpers/AuthHelper';
import { authorize, bypassBankid, cancelRequest, resetCancel } from "../../services/UserService";
import { canOpenUrl } from "../../helpers/LinkHelper";
import { sanitizePin, validatePin } from "../../helpers/ValidationHelper";
import LoginForm from '../shared/LoginForm';

const USERKEY = 'user';

const LOGIN_CONVERSATION = [
    {
        type: 'string',
        size: 1,
        sender: "automated",
        value: "Hej!"
    },
    {
        type: 'string',
        size: 2,
        sender: "automated",
        value: "Välkommen till Mitt Helsingborg!"
    },
    {
        type: 'string',
        size: 3,
        sender: "automated",
        value: "Ut accumsan lacus nec ex tempus vehicula. Suspendisse risus urna, maximus at egestas at, posuere eget tellus. Pellentesque vitae condimentum sem. Integer mollis porta elementum."
    },
    {
        type: 'string',
        size: 3,
        sender: "automated",
        value: "Logga in så kör vi!"
    },
    {
        type: 'separator',
        size: 3,
        sender: "automated",
        value: "Logga in med Mobilt BankID"
    },
    {
        type: 'component',
        size: 3,
        sender: "automated",
        value: "login"
    },
]

class LoginChatScreen extends Component {
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
        this.setUserAsync();
        this.isBankidInstalled();
        this.runConversation();
    }

    runConversation = () => {
        for (let i = 0; i < LOGIN_CONVERSATION.length; i++) {

            setTimeout(() => {
                console.log(LOGIN_CONVERSATION[i]);

                let { messages } = this.state;
                messages.push(LOGIN_CONVERSATION[i]);
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
            <View>
                {isLoading === false ? (
                    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>

                        {/* List conversation items */}
                        <ConversationList
                            serviceId={this.state.serviceId}
                            items={messages} />

                        {/* Input */}
                        <View
                            style={styles.loginContainer}
                            testID={"ViewLogin"}
                        >

                            {user.personalNumber !== 'undefined' && user.personalNumber ? (
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
                                        <Button
                                            accessible={true}
                                            testID={"ChangeLogInUser"}
                                            title="Logga in som en annan användare"
                                            color="#000"
                                            onPress={() => this.resetUser()}
                                        />
                                    </View>
                                </>
                            ) : (
                                    <>
                                        <Text style={styles.infoText}>Mobilt BankID</Text>
                                        <View style={styles.paper}>
                                            <Text style={styles.label}>Personnummer</Text>
                                            <TextInput
                                                style={styles.inputField}
                                                keyboardType='number-pad'
                                                returnKeyType='done'
                                                maxLength={12}
                                                placeholder={'ÅÅÅÅMMDDXXXX'}
                                                onChangeText={(value) => this.setPin(value)}
                                                onSubmitEditing={this.checkPin}
                                                value={personalNumberInput}
                                            />

                                            <TouchableOpacity
                                                style={[styles.button, !validPin ? styles.buttonDisabled : '']}
                                                onPress={() => this.authenticateUser(personalNumberInput)}
                                                underlayColor='#fff'
                                                disabled={!validPin}
                                            >
                                                <Text style={[styles.buttonText, !validPin ? styles.buttonTextDisabled : '']}>Logga in</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={styles.loginFooter}>
                                            <Button
                                                title="Läs mer om hur du skaffar mobilt BankID"
                                                color="#000"
                                                onPress={() => {
                                                    Linking.openURL("https://support.bankid.com/sv/bankid/mobilt-bankid")
                                                        .catch(() => console.log("Couldnt open url"));
                                                }}
                                            />
                                        </View>
                                    </>
                                )}
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
            </View>
        );
    }
}

export default LoginChatScreen;

class ConversationList extends Component {

    getComponent = (key) => {
        const components = {
            login: LoginForm,
        };
        return components[key];
    }

    renderItem = ({ item, index }) => {

        switch (item.type) {
            case 'component':
                const ChatComponent = this.getComponent(item.value);
                console.log("ChatComponent", ChatComponent);
                return <ChatComponent {...item} />
            case 'separator':
                return <View style={{ color: 'grey', borderRadius: 3, padding: 10, margin: 10 }}>
                    <Text style={{ color: 'white', fontSize: 18 }} >{item.value}</Text>
                </View>

            default:
                return <View style={{ backgroundColor: '#D35098', borderRadius: 3, padding: 10, margin: 10 }}>
                    <Text style={{ color: 'white', fontSize: 18 }} >{item.value}</Text>
                </View>

        }
    }

    render() {
        return (
            <FlatList
                inverted={false}
                data={this.props.items}
                renderItem={(item, index) => this.renderItem(item, index)}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingTop: 10, paddingBottom: 10 }}
            />
        )
    }
}

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
        // flex: 1,
        // alignItems: 'stretch',
        // padding: 16,
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


