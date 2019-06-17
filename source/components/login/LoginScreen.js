import React, { Component } from 'react';
import { KeyboardAvoidingView, Alert, TouchableOpacity, ActivityIndicator, StyleSheet, Text, View, Linking, TextInput } from 'react-native';
import { authorizeUser, openBankId } from "../../services/UserService";
import { sanitizePno, validatePno } from "../../helpers/ValidationHelper";

class LoginScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            validPno: false,
            hasBankId: false,
            isLoading: false,
            appSettings: {
                pno: '',
                autoStartToken: ''
            }
        };
    }

    componentDidMount() {
        const { appSettings } = this.state;
        this.validatePno(appSettings.pno);

        // Test if BankID is installed
        Linking.canOpenURL('bankid:///')
            .then((supported) => {
                if (supported) {
                    console.log("Has bankid");
                    this.setState({
                        hasBankId: true
                    });
                } else {
                    console.log("Can't open url: bankid:///");
                }
            })
            .catch((err) => console.error('An error occurred', err));
    }

    /**
     * Validate personal number
    */
    validatePno = (pno) => {
        if (validatePno(pno)) {
            this.setState({ validPno: true });
        } else {
            this.setState({ validPno: false });
        }
    }

    setPno(pno) {
        pno = sanitizePno(pno);

        this.validatePno(pno);

        this.setState({
            appSettings: {
                pno
            }
        });
    }

    authenticateUser = async () => {
        this.setState({ isLoading: true });
        const { hasBankId, appSettings } = this.state;

        if (!appSettings.pno) {
            Alert.alert("Personnummer saknas");
            this.setState({ isLoading: false });
            return;
        }

        if (hasBankId) {
            /**
             * TODO:
             * Get valid autostart token
             * Also fix redirect param, it fails when autostarttoken is added
             */
            openBankId(appSettings.autoStartToken);
        }

        await authorizeUser(appSettings.pno)
            .then(authResponse => {
                console.log("Token", authResponse.data.token);
                this.props.setUser(authResponse.data.user);
            })
            .catch(error => {
                // TODO: Fix error notice
                console.log("authResponse Fail", error);
                this.setState({ isLoading: false });
                Alert.alert("Något fick fel");
            });
    };

    abortLogin = () => {
        this.setState({ isLoading: false });
    }

    checkPno = () => {
        const { validPno } = this.state;
        if (!validPno) {
            Alert.alert("Felaktigt personnummer. Ange format ÅÅÅÅMMDDXXXX.");
        }
    }

    render() {
        const { isLoading, validPno, appSettings } = this.state;

        return (
            <>
                {isLoading === false ? (
                    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                        <View style={styles.content}>
                            <Text style={styles.header}>Mitt{"\n"}Helsingborg</Text>
                        </View>

                        <View style={styles.loginContainer}>
                            <View>
                                <Text style={styles.label}>Personnummer</Text>

                                <TextInput
                                    style={styles.inputField}
                                    keyboardType='number-pad'
                                    returnKeyType='done'
                                    maxLength={12}
                                    placeholder={'ÅÅÅÅMMDDXXXX'}
                                    onChangeText={(value) => this.setPno(value)}
                                    onSubmitEditing={this.checkPno}
                                    value={appSettings.pno}
                                />

                                <TouchableOpacity
                                    style={[styles.button, !validPno ? styles.buttonDisabled : '']}
                                    onPress={this.authenticateUser}
                                    underlayColor='#fff'
                                    disabled={!validPno}
                                >
                                    <Text style={[styles.buttonText, !validPno ? styles.buttonTextDisabled : '']}>
                                        {validPno ? 'Logga in' : 'Logga in med BankID'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.loginFooter}>
                                <Text>Läs mer om hur du skaffar mobilt BankID</Text>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                ) : (
                        <View style={styles.container}>
                            <View style={styles.content}>
                                <ActivityIndicator size="large" color="slategray" />
                            </View>
                            <View style={styles.loginContainer}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={this.abortLogin}
                                    underlayColor='#fff'>
                                    <Text style={styles.buttonText}>Avbryt</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }
            </>
        );
    }
}

export default LoginScreen;

const styles = StyleSheet.create({
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
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    inputField: {
        height: 48,
        borderColor: '#D3D3D3',
        borderWidth: 1,
        marginBottom: 16,
        borderRadius: 7,
        paddingLeft: 8,
        backgroundColor: '#D3D3D3'
    },
});
