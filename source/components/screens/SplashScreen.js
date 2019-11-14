import React, { Component } from 'react';
import {Text, View, StyleSheet, ImageBackground} from 'react-native';
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
            <View style={{paddingStart: 190, paddingTop: 40, width: 500}}>
                <Button onClick={() => this.props.navigation.navigate('Chat')} color={'purpleLight'} pill>
                    <Text style={{color: 'white'}}>Nu vill jag testa!</Text>
                </Button>
            </View>
        )
    };

    slideEasy = () => {
        return (
            <View style={styles.slideEasy}>
                <View style={{flex: 4, justifyContent: 'center', alignItems: 'center'}}>
                    <ImageBackground
                        source={require('../../assets/slides/illu_001.png')}
                        style={{width: 300, height: 300}}
                    />
                </View>
                <View style={{flex: 2}}>
                    <Heading type="h2">Enkelt</Heading>
                    <Text>
                        {'\n'}
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
                <View style={{flex: 4, justifyContent: 'center', alignItems: 'center'}}>
                    <ImageBackground
                        source={require('../../assets/slides/illu_002.png')}
                        style={{width: 230, height: 260}}
                    />
                </View>
                <View style={{flex: 2}}>
                    <Heading type="h2">Tillgängligt</Heading>
                    <Text>
                        {'\n'}
                        Du kan också följa dina ärenden, ställa frågor eller prata med oss.{'\n\n'}
                        När du vill.
                    </Text>
                </View>
                <View style={{flex: 1}} />
            </View>
        )
    };

    slidePersonal = () => {
        const { ButtonDisableSplash } = this;
        return (
            <View style={styles.slideEasy}>
                <View style={{flex: 4, justifyContent: 'center', alignItems: 'center'}}>
                    <ImageBackground
                        source={require('../../assets/slides/illu_003.png')}
                        style={{width: 300, height: 300}}
                    />
                </View>
                <View style={{flex: 2}}>
                    <Heading type="h2">Personligt</Heading>

                    <Text>
                        {'\n'}
                        Inloggad ger mer.{'\n\n'}
                        Som inloggad får du en personblig upplevelse anpassad för dig.
                    </Text>

                </View>

                <View style={{flex: 1}}>

                    <ButtonDisableSplash/>

                </View>
            </View>
        )
    };

    /**
     * Remove next buttons for last screen.
     */
    swipeAction = (index) => {
        if (index === 2) {
            this.setState({ disableSwipeNext: false })
        } else {
            this.setState({ disableSwipeNext: true })
        }
    };

    render() {
        return (
            <EnhancedScreenWrapper>
                <Swiper
                    buttonWrapperStyle={styles.buttonWrapperStyle}
                    showsButtons={this.state.disableSwipeNext}
                    prevButton={<Text style={styles.buttonText} />}
                    nextButton={<Text style={{fontSize: 40, color: '#D35098'}}>›</Text>}
                    dot={<View style={styles.dot} />}
                    activeDot={<View style={styles.activeDot} />}
                    paginationStyle={{paddingEnd: 200}}
                    onIndexChanged={(index) => this.swipeAction(index)}
                    loop={false}
                >

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
    buttonWrapperStyle: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        paddingBottom: 25,
        paddingRight: 30,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    dot: {
        width: 10,
        height: 10,
        borderWidth: 1,
        borderColor: '#610839',
        borderRadius: 8,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 3,
        marginBottom: 20,
    },
    activeDot: {
        backgroundColor: '#610839',
        width: 10,
        height: 10,
        borderRadius: 8,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 3,
        marginBottom: 20,
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
