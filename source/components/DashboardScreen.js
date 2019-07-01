import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { sign, cancelRequest } from "../services/UserService";
import { canOpenUrl } from "../helpers/LinkHelper";

class DashboardScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isBankidInstalled: false,
            isLoading: false,
        }
    }

    componentDidMount() {
        this.isBankidInstalled();
    }

    isBankidInstalled = async () => {
        const isBankidInstalled = await canOpenUrl('bankid:///');

        if (isBankidInstalled) {
            this.setState({ isBankidInstalled: true });
        }
    }

    signWithBankid = async () => {
        this.setState({ isLoading: true });

        const { user } = this.props;

        await sign(
            user.personalNumber,
            'Sign me please'
        ).then(response => {
            response.ok ? Alert.alert("Great success 🤘") : Alert.alert("Sign failed 🙈");
        }).catch(error => console.log(error));

        this.setState({ isLoading: false });
    }

    cancelSign = () => {
        cancelRequest().catch(error => console.log(error));
        this.setState({ isLoading: false });
    }

    render() {

        const { isLoading, isBankidInstalled } = this.state;
        const { user } = this.props;

        return (
            <>
                {isLoading ? (
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
                                onPress={this.cancelSign}
                                underlayColor='#fff'>
                                <Text style={styles.buttonText}>Avbryt</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                        <View style={styles.container} >
                            <Text style={styles.header}>Greetings {user.givenName}!</Text>
                            <Text style={{ fontSize: 60 }}>🦄</Text>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={this.signWithBankid}
                                underlayColor='#fff'
                            >
                                <Text style={styles.buttonText}>Sign me plx</Text>
                            </TouchableOpacity>
                        </View >
                    )
                }
            </>
        );
    }
}

export default DashboardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16
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
    infoText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 24,
        marginBottom: 24
    },
    header: {
        fontSize: 20
    },
    button: {
        width: '100%',
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: '#007AFF',
        borderRadius: 7,
        marginTop: 80
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
