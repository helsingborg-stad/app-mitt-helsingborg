import React, { Component } from 'react';
import { Alert, TouchableOpacity, ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Link } from 'react-router-native';
import { authorizeUser } from "../../services/UserService";

class LoginScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };
    }

    authenticateUser = async () => {
        this.setState({ isLoading: true });
        const { appSettings } = this.props;

        if (!appSettings.pno) {
            Alert.alert("Personnummer saknas.");
            this.setState({ isLoading: false });
            return;
        }

        await authorizeUser(appSettings.pno)
            .then(authResponse => {
                console.log("authResponse ok", authResponse);
                console.log("USER", authResponse.data.user);

                this.props.setUser(authResponse.data.user);
            })
            .catch(error => {
                // TODO: show error message
                console.log("authResponse Fail", error);
                this.setState({ isLoading: false });
                Alert.alert("Något fick fel");
            });
    };

    abortLogin = () => {
        this.setState({ isLoading: false });
    }

    render() {
        let { isLoading } = this.state;

        return (
            <>
                {isLoading === false ? (
                    <View style={styles.container}>

                        <View style={styles.content}>
                            <Text style={styles.header}>Mitt Helsingborg</Text>
                        </View>

                        <View style={styles.bottom}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={this.authenticateUser}
                                underlayColor='#fff'>
                                <Text style={styles.buttonText}>Logga in</Text>
                            </TouchableOpacity>
                            <Link to="/editlogin" style={styles.editLoginLink}>
                                <Text>Ändra inloggning</Text>
                            </Link>
                        </View>
                    </View>
                ) : (
                        <View style={styles.container}>
                            <View style={styles.content}>
                                <ActivityIndicator size="large" color="slategray" />
                            </View>
                            <View style={styles.bottom}>
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
    bottom: {
        flex: 0,
        width: '100%',
        marginBottom: 30
    },
    button: {
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: 'cadetblue',
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
    },
    header: {
        fontSize: 25
    },
    editLoginLink: {
        alignSelf: 'flex-end',
        marginTop: 16,
    }
});
