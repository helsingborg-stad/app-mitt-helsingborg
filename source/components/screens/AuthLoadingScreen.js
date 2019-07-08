import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    View,
} from 'react-native';
import StorageService from '../../services/StorageService';

const USERKEY = 'user';
const TOKENKEY = 'accessToken';

class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.bootstrapAsync();
    }

    // TODO: Validate access token
    isLoggedIn = async () => {
        const accessToken = await StorageService.getData(TOKENKEY);
        console.log("accessToken", accessToken);

        return !!accessToken;
    }

    // Fetch the token from storage then navigate to our appropriate place
    bootstrapAsync = async () => {
        const isLoggedIn = await this.isLoggedIn();
        console.log("isLoggedIn", isLoggedIn);

        this.props.navigation.navigate(isLoggedIn ? 'App' : 'Auth');
    };

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
