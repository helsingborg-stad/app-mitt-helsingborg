import React, { Component } from 'react';
import {Text, View, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native';
import { SHOW_SPLASH_SCREEN } from "../../services/StorageService";
import AsyncStorage from '@react-native-community/async-storage';
import Swiper from "react-native-swiper";
import ScreenWrapper from '../molecules/ScreenWrapper';
import styled from 'styled-components/native';
import Heading from "../atoms/Heading";
import Button from "../atoms/Button";


/**
 * Splash screen that shall be displayed during first app initiation or after an app update.
 *
 * SHOW_SPLASH_SCREEN is a persistent variable that will route navigation to ether AuthLoading or display splash screen.
 */
export default class SplashScreen extends Component {
    state = {
        disableSwipeNext: true,
    };

    componentWillMount() {
        this.showSplash();
    }

    /**
     * Navigate to AuthLoading if splash screen disabled.
     */
    showSplash = () => {
        AsyncStorage.getItem(SHOW_SPLASH_SCREEN).then((value => {
            let showSplash = true;
            if (value) showSplash = JSON.parse(value);

            if (!showSplash) {
                this.props.navigation.navigate('AuthLoading');
            }
        }))
    };

    /**
     * Set state disable for splash screen.
     */
     disableSplash = () => {
        AsyncStorage.setItem(SHOW_SPLASH_SCREEN, JSON.stringify(false));

        this.props.navigation.navigate('Chat');
    };

    /**
     * Button for disabling splash screen.
     */
    ButtonDisableSplash = () => {
        return (
            <View style={{paddingStart: 205, paddingTop: 590}}>
                <Button color={'purple'} pill>
                    <Text>Nu vill jag testa!</Text>
                </Button>
            </View>
        )
    };

    slideEasy = () => {
        return (
            <View style={styles.slideEasy}>
                <View style={{flex: 5, justifyContent: 'center', alignItems: 'center'}}>
                    <ImageBackground
                        source={require('../../assets/slides/slideEasy.png')}
                        style={{width: 250, height: 250}}
                    />
                </View>
                <View style={{flex: 3}}>
                    <Heading type="h2">Enkelt</Heading>
                    <Text>
                        Mitt Helsingborg är appen där du enkelt får tillgång till tjänster och information från kommunen.{'\n\n'}
                        Allt samlat i mobilen.
                    </Text>
                </View>
                <View style={{flex: 1}} />
            </View>
        )
    };

    slideAccessible = () => {
        return (
            <View style={styles.slideEasy}>
                <View style={{flex: 5, justifyContent: 'center', alignItems: 'center'}}>
                    <ImageBackground
                        source={require('../../assets/slides/slideEasy.png')}
                        style={{width: 250, height: 250}}
                    />
                </View>
                <View style={{flex: 3}}>
                    <Heading type="h2">Tillgängligt</Heading>
                    <Text>
                        {'\n'}
                        Inloggad ger mer.{'\n\n'}
                        Som inloggad får du en personblig upplevelse anpassad för dig.
                    </Text>
                </View>
                <View style={{flex: 1}} />
            </View>
        )
    };

    slidePersonal = () => {
        const { ButtonDisableSplash } = this;
        return (
            <View >
                <ButtonDisableSplash />
            </View>
        )
    };

    render() {
        const {ButtonDisableSplash} = this;
        return (
            <EnhancedScreenWrapper>
                <Swiper showsButtons={this.state.disableSwipeNext}>

                    { this.slideEasy() }
                    { this.slideAccessible() }
                    { this.slidePersonal() }

                </Swiper>
            </EnhancedScreenWrapper>
        )
    }
}

const EnhancedScreenWrapper = styled(ScreenWrapper)`
    padding: 0px;
`;


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
    slideEasy: {
        flex: 1,
        padding: 30,
        backgroundColor: '#F5F5F5',
        justifyContent: 'flex-end'
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
