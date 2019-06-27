import React, { Component } from 'react';
import { KeyboardAvoidingView, Alert, TouchableOpacity, ActivityIndicator, StyleSheet, Text, View, TextInput, Linking, Button } from 'react-native';
import { authorizeUser } from "../../services/UserService";
import { canOpenUrl } from "../../helpers/LinkHelper";
import { sanitizePno, validatePno } from "../../helpers/ValidationHelper";

class LoginScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isBankidInstalled: false,
            validPno: false,
            isLoading: false,
            personalNumberInput: '',
        };
    }

    componentDidMount() {
        const { user } = this.props;
        const personalNumber = typeof user.personalNumber !== 'undefined' && user.personalNumber ? user.personalNumber : '';

        this.setState({
            personalNumberInput: personalNumber
        });

        this.validatePno(personalNumber);

        this.isBankidInstalled();
    }

    isBankidInstalled = async () => {
        const isBankidInstalled = await canOpenUrl('bankid:///');
        console.log("isBankidInstalled", isBankidInstalled);

        if (isBankidInstalled) {
            this.setState({ isBankidInstalled: true });
        }
    };

    /**
     * Validate personal number
    */
    validatePno = (pno) => {
        if (validatePno(pno)) {
            this.setState({ validPno: true });
        } else {
            this.setState({ validPno: false });
        }
    };

    setPno(pno) {
        pno = sanitizePno(pno);

        this.validatePno(pno);

        this.setState({
            personalNumberInput: pno
        });
    }

    authenticateUser = async () => {
        this.setState({ isLoading: true });
        const { personalNumberInput } = this.state;

        if (!personalNumberInput) {
            Alert.alert("Personnummer saknas");
            this.setState({ isLoading: false });
            return;
        }

        await authorizeUser(personalNumberInput)
            .then(authResponse => {
                if (authResponse.ok === true) {
                    console.log("authResponse success", authResponse);
                    this.props.loginUser(authResponse.status.user);
                } else {
                    console.log("authResponse Fail", authResponse);
                    this.setState({ isLoading: false });
                    Alert.alert("Något fick fel");
                }
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
    };

    checkPno = () => {
        const { validPno } = this.state;
        if (!validPno) {
            Alert.alert("Felaktigt personnummer. Ange format ÅÅÅÅMMDDXXXX.");
        }
    };

    render() {
        const { user, resetUser } = this.props;
        const { isLoading, validPno, personalNumberInput, isBankidInstalled } = this.state;

        return (
            <>
                {isLoading === false ? (
                    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                        <View style={styles.content}>
                            <Text style={styles.header}>Mitt{"\n"}Helsingborg</Text>
                        </View>

                        <View style={styles.loginContainer}>

                            {user.personalNumber !== 'undefined' && user.personalNumber ? (
                                <>
                                    <TouchableOpacity
                                        style={[styles.button, !validPno ? styles.buttonDisabled : '']}
                                        onPress={this.authenticateUser}
                                        underlayColor='#fff'
                                        disabled={!validPno}
                                    >
                                        <Text style={[styles.buttonText, !validPno ? styles.buttonTextDisabled : '']}>Logga in</Text>
                                    </TouchableOpacity>
                                    <View style={styles.loginFooter}>
                                        <Button
                                            title="Logga in som en annan användare"
                                            color="#000"
                                            onPress={resetUser}
                                        />
                                    </View>
                                </>
                            ) : (
                                    <>
                                        <Text style={styles.infoText}>Logga in med BankID</Text>
                                        <View style={styles.paper}>
                                            <Text style={styles.label}>Personnummer</Text>
                                            <TextInput
                                                style={styles.inputField}
                                                keyboardType='number-pad'
                                                returnKeyType='done'
                                                maxLength={12}
                                                placeholder={'ÅÅÅÅMMDDXXXX'}
                                                onChangeText={(value) => this.setPno(value)}
                                                onSubmitEditing={this.checkPno}
                                                value={personalNumberInput}
                                            />

                                            <TouchableOpacity
                                                style={[styles.button, !validPno ? styles.buttonDisabled : '']}
                                                onPress={this.authenticateUser}
                                                underlayColor='#fff'
                                                disabled={!validPno}
                                            >
                                                <Text style={[styles.buttonText, !validPno ? styles.buttonTextDisabled : '']}>Logga in</Text>
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
