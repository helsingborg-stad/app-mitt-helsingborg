import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    View,
} from 'react-native';
import Auth from '../../helpers/AuthHelper';

class AuthLoadingScreen extends React.Component {

    constructor(props) {
        super(props);
        this.authAsync();
    }

    authAsync = async () => {
        const loggedIn = await Auth.loggedIn();

        if (!loggedIn) {
            this.props.navigation.navigate('Auth');
        } else {
            await Auth.confirmUser()
                .then(() => this.props.navigation.navigate('App'))
                .catch(() => {
                    Auth.logout();
                    this.props.navigation.navigate('Auth');
                });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <ActivityIndicator size="large" color="slategray" />
                </View>
            </View>
        );
    }
}

export default AuthLoadingScreen;

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
    }
});
