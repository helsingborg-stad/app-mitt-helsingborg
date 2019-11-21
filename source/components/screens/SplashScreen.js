import React, { Component } from 'react';
import {View, StyleSheet, ImageBackground, PanResponder} from 'react-native';
import { SHOW_SPLASH_SCREEN } from "../../services/StorageService";
import AsyncStorage from '@react-native-community/async-storage';
import Swiper from "react-native-swiper";
import ScreenWrapper from '../molecules/ScreenWrapper';
import styled from 'styled-components/native';
import Heading from "../atoms/Heading";
import Button from "../atoms/Button";
import Text from "../atoms/Text";
import Icon from "../atoms/Icon";

/**
 * Splash screen that shall be displayed during first app initiation or after an app update.
 *
 * SHOW_SPLASH_SCREEN is a persistent variable that will route navigation to ether AuthLoading or display splash screen.
 */
export default class SplashScreen extends Component {
    state = {
        showSwipeInterface: true,
        swipeButtonText: 'Kom igång',
        swipeIndex: 0
    };

    componentWillMount() {
        this.showSplash();

        this._panResponder = PanResponder.create({
            onPanResponderMove: (evt, gestureState) => {
                if (this.state.swipeIndex === 2 && this.state.showSwipeInterface === true) {
                    if (gestureState.dx < 0) {
                        this.setState({showSwipeInterface: false})
                    }
                }
            },

            onPanResponderRelease: (evt, gestureState) => {
                setTimeout(() => {
                    if (this.state.swipeIndex <= 2) {
                        this.setState({showSwipeInterface: true});
                    }
                }, 400)
            }
        });
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

        this.props.navigation.navigate('LoginScreen');
    };

    /**
     * Button for disabling splash screen.
     */
    ButtonDisableSplash = () => {
        return (
            <View style={{paddingStart: 25, paddingEnd: 25, paddingTop: 35, }}>
                <Button onClick={() => this.props.navigation.navigate('LoginScreen')} color={'purpleLight'} block>
                    <Text style={{color: 'white', fontSize: 16, fontFamily: 'Roboto', fontWeight: '500'}}>Logga in med Mobilt BankID</Text>
                </Button>
            </View>
        )
    };

    swipeWelcome = ()  => {
        return (
            <View style={styles.slideEasy}>
                <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
                    <ImageBackground
                        style={{width: 130, height: 200}}
                        source={require('../../assets/slides/stadsvapen.png')}
                    />
                </View>
                <View style={{flex: 2}}>
                    <View style={{flex: 1}}>
                        <Heading type="h2">Mitt {'\n'}Helsingborg</Heading>
                    </View>

                    <View style={{flex: 1}}>
                        <Text style={{fontSize: 25, lineHeight: 28}}>
                            Välkommen!
                        </Text>
                    </View>
                </View>
                <View style={{flex: 1}} />
            </View>
        )

    };

    slideEasy = () => {
        return (
            <View style={styles.slideEasy}>
                <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
                    <ImageBackground
                        source={require('../../assets/slides/illu_001.png')}
                        style={{width: 300, height: 300}}
                    />
                </View>
                <View style={{flex: 2}}>
                    <View style={{flex: 1}}>
                        <Heading type="h2">Enkelt</Heading>
                    </View>

                    <View style={{flex: 2}}>
                        <Text style={{fontSize: 19, lineHeight: 28}}>
                            Mitt Helsingborg är appen där du enkelt får tillgång till tjänster och information från kommunen.
                        </Text>
                    </View>
                </View>
                <View style={{flex: 1}} />
            </View>
        )
    };

    slideAccessible = () => {
        return (
            <View style={styles.slideEasy}>
                <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
                    <ImageBackground
                        source={require('../../assets/slides/illu_002.png')}
                        style={{width: 230, height: 260}}
                    />
                </View>
                <View style={{flex: 2}}>
                    <View style={{flex: 1}}>
                        <Heading type="h2">Nära</Heading>
                    </View>

                    <View style={{flex: 2}}>
                        <Text style={{fontSize: 19, lineHeight: 28}}>
                            Du kan följa och hantera dina ärenden, få personlig service eller bli tipsad om saker som händer nära dig.
                        </Text>
                    </View>
                </View>
                <View style={{flex: 1}} />
            </View>
        )
    };

    slidePersonal = () => {
        const { ButtonDisableSplash } = this;
        return (
            <View style={styles.slideEasy}>
                <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
                    <ImageBackground
                        source={require('../../assets/slides/illu_003.png')}
                        style={{width: 300, height: 300}}
                    />
                </View>
                <View style={{flex: 2}}>
                    <View style={{flex: 1}}>
                        <Heading type="h2">Personligt</Heading>
                    </View>
                    <View style={{flex: 2}} >
                        <Text style={{fontSize: 18, lineHeight: 23}}>
                            Inloggad ger mer. Som inloggad får du en personlig upplevelse anpassad för dig.{'\n\n'}
                            Allt samlat i mobilen.
                        </Text>
                    </View>

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
        if (index === 0) {
            this.setState({ swipeButtonText: 'Kom igång'})
        } else if (index === 2) {
            this.setState({ showSwipeInterface: true })
        }
        else if (index === 3) {
            this.setState({ showSwipeInterface: false })
        } else {
            // this.setState({ disableSwipeInterface: true })
            this.setState({ swipeButtonText: 'Nästa'})
        }

        this.setState({swipeIndex: index})
    };

    swipeToNext = () => {
        this._swiper.scrollBy(1);

        if (this.state.swipeIndex === 2) {
            this.setState({showSwipeInterface: false})
        }
    };

    render() {
        return (
            <EnhancedScreenWrapper>
                <Swiper
                    {...this._panResponder.panHandlers}
                    ref={(swiper) => {this._swiper = swiper}}
                    style={{ overflow: 'visible' }}
                    buttonWrapperStyle={styles.buttonWrapperStyle}
                    showsPagination={this.state.showSwipeInterface}
                    showsButtons={this.state.showSwipeInterface}
                    prevButton={<Text style={styles.buttonText} />}
                    nextButton={
                        <Button color={'swipe'} z={5} onClick={() => this.swipeToNext()}>
                            <Text>{this.state.swipeButtonText}</Text>
                            <Icon name="chevron-right" color={'purple'}/>
                        </Button>
                    }
                    dot={<View style={styles.dot} />}
                    activeDot={<View style={styles.activeDot} />}
                    paginationStyle={{paddingEnd: 195}}
                    onIndexChanged={(index) => this.swipeAction(index)}
                    loop={false}
                >

                    { this.swipeWelcome() }
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
        width: 15,
        height: 15,
        borderWidth: 2,
        borderColor: '#610839',
        borderRadius: 8,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 3,
        marginBottom: 20,
    },
    activeDot: {
        backgroundColor: '#610839',
        width: 15,
        height: 15,
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


