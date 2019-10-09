import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    View,
} from 'react-native';
import Auth from '../../helpers/AuthHelper';
import ScreenWrapper from '../molecules/ScreenWrapper';

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
            <ScreenWrapper>
                <View style={styles.content}>
                    <ActivityIndicator size="large" color="slategray" />
                </View>
            </ScreenWrapper>
        );
    }
}

export default AuthLoadingScreen;

const styles = StyleSheet.create({
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
