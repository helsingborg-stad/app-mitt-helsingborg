import React, { Component } from 'react';
import { TextInput, Alert, TouchableOpacity, ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Redirect } from 'react-router-native';
import { validatePno } from "../../helpers/ValidationHelper";
import { authorizeUser, bypassBankid } from "../../services/UserService";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            showError: false,
            error: '',
            personalNumberInput: '',
        };
    }

    authenticateUser = () => {
        this.setState({ isLoading: true });

        const { personalNumberInput } = this.state;

        // validate personal number.
        if (validatePno(personalNumberInput)) {
            setTimeout(() => {
                console.log("PNO regex validated");
                // send auth request to api.
                this.sendAuthorizeRequest(personalNumberInput);
            }, 1000);
        } else {
            console.log("PNO regex Failed");
            // if validation failed show error text.
            this.setState({ isLoading: false, showError: true, error: 'PNO validation failed!' });
        }
    };

    sendAuthorizeRequest = async (personalNumber) => {

        await authorizeUser(personalNumber)
            .then(authResponse => {
                console.log("authResponse ok", authResponse);
                console.log("USER", authResponse.data.user);

                this.props.history.push('/');
            })
            .catch(error => {
                // TODO: show error message
                console.log("authResponse Fail", error);
                this.setState({ isLoading: false, showError: false, error: '' });
            });

        // if (authResponse) {
        //     console.log("authResponse ok", authResponse);
        //     console.log("USER", authResponse.data.user);
        //     Redirect
        //     // When everything is ok, saving token, pno and dispatching SUCCESS action.
        //     // setAuthToken(authResponse.data.token);
        //     // setUserPno(authResponse.data.user.personalNumber);
        //     // Store.dispatch(loginSuccess({ ...authResponse.data.user }));
        // }
    };

    handlePnoInputChange = (value) => {
        this.setState({
            personalNumberInput: value,
        });
    };

    render() {
        let { isLoading, showError, error } = this.state;

        return (
            <>
                {isLoading === false ? (
                    <View style={styles.container}>
                        <Text style={styles.header}>Mitt Helsingborg</Text>

                        {showError &&
                            <Text style={styles.errorMessage}>{error}</Text>
                        }

                        <View style={styles.bottom}>
                            <TextInput
                                style={styles.inputField}
                                onChangeText={(value) => this.handlePnoInputChange(value)}
                                value={this.state.text}
                            />
                            <TouchableOpacity
                                style={styles.loginScreenButton}
                                onPress={this.authenticateUser}
                                underlayColor='#fff'>
                                <Text style={styles.loginText}>Logga in</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                        <View style={styles.spinner}>
                            <ActivityIndicator size="large" color="slategray" />
                        </View>
                    )
                }
            </>
        );
    }
}

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'whitesmoke',
        padding: 16,
    },
    bottom: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
        marginBottom: 32
    },
    loginScreenButton: {
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: 'slategray',
        borderRadius: 5,
    },
    loginText: {
        color: '#fff',
        textAlign: 'center',
    },
    header: {
        fontSize: 20
    },
    errorMessage: {
        color: 'red'
    },
    spinner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputField: {
        height: 48,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 16,
        borderRadius: 5,
        paddingLeft: 8
    }
});
