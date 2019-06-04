import React, { Component } from 'react';
import { Alert, TouchableOpacity, ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'whitesmoke',
        padding: 16,
    },
    loginScreenButton: {
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: 'slategray',
        borderRadius: 5,
    },
    bottom: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
        marginBottom: 32
    },
    loginText: {
        color: '#fff',
        textAlign: 'center',
    },
    header: {
        fontSize: 20
    },
});

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            showError: false,
            personalNumberInput: "",
        };
    }

    authenticateUser = (event) => {
        this.setState({ isLoading: true });

        const { personalNumberInput } = this.state;

        // // validate personal number.
        // if (validatePno(personalNumberInput)) {
        //     setTimeout(() => {
        //         // send auth request to api.
        //         this.sendAuthorizeRequest(personalNumberInput);
        //     }, 1000);
        // } else {
        //     // if validation failed show error text.
        //     this.setState({ isLoading: false, showError: true });
        // }
    }

    render() {

        let { isLoading } = this.state;

        return (
            <View style={styles.container}>

                {isLoading === false ? (
                    <>
                        <Text style={styles.header}>Login screen</Text>
                        <View style={styles.bottom}>
                            <TouchableOpacity
                                style={styles.loginScreenButton}
                                onPress={this.authenticateUser}
                                underlayColor='#fff'>
                                <Text style={styles.loginText}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                        <ActivityIndicator size="large" color="slategray" />
                    )}

            </View>
        );
    }
}

export default Login;
