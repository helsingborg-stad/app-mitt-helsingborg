import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { SHOW_SPLASH_SCREEN } from "../../services/StorageService";
import AsyncStorage from '@react-native-community/async-storage';
import Swiper from "react-native-swiper";

/**
 * Splash screen that shall be displayed during first app initiation or after an app update.
 *
 * SHOW_SPLASH_SCREEN is a persistent variable that will route navigation to ether AuthLoading or display splash screen.
 */
export default class SplashScreen extends Component {
    componentWillMount() {
        this.showSplash();
    }

    /**
     * Navigate to AuthLoading if splash screen disabled.
     */
    showSplash() {
        AsyncStorage.getItem(SHOW_SPLASH_SCREEN).then((value => {
            let showSplash = true;

            if (value) {
                showSplash = JSON.parse(value);
            }

            if (!showSplash) {
                this.props.navigation.navigate('AuthLoading');
            }
        }))
    }

    /**
     * Set state disable for splash screen.
     */
    disableSplash() {
        AsyncStorage.setItem(SHOW_SPLASH_SCREEN, JSON.stringify(false));

        this.props.navigation.navigate('AuthLoading');
    }

    /**
     * Button for disabling splash screen.
     */
    buttonDisableSplash() {
        return (
            <View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.disableSplash()}
                >
                    <Text style={styles.buttonText}>Godkänn och gå vidare</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <Swiper showsButtons={true}>
                <View style={styles.slide1}>
                    <Text style={styles.textTitle}>Swipa on!</Text>
                </View>
                <View style={styles.slide2}>
                    <Text style={styles.textTitle}>Personuppgifter</Text>
                    <Text style={styles.text}>Vi använder dina personuppgifter för specifika ändamål som vi har informerat dig om eller som du har samtyckt till. Vi samlar inte in fler uppgifter än de som vi behöver för att kunna leverera de tjänster du vill ha, eller de som lagen kräver att vi samlar in.</Text>
                    {this.buttonDisableSplash()}
                </View>
            </Swiper>
        )
    }
}

const styles = StyleSheet.create({
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5',
    },
    textTitle: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    text: {
        color: '#fff',
        paddingTop: 15,
        paddingHorizontal: 40,
        fontSize: 15,
        fontWeight: 'bold',
    },
    button: {
        width: '100%',
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: '#0336FF',
        borderRadius: 7,
        marginTop: 40
    },
    buttonText: {
        paddingHorizontal: 10,
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
    }
});
