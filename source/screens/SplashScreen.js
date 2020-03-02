import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ImageBackground, PanResponder } from 'react-native';
import Swiper from 'react-native-swiper';
import styled from 'styled-components/native';
import { Button, Heading, Icon, Text } from 'app/components/atoms';
import { StorageService } from 'app/services';
import { ScreenWrapper } from 'app/components/molecules';

import { SLIDES } from 'app/assets/images';

const { SLIDE_001_PNG, SLIDE_002_PNG, SLIDE_003_PNG, STADSVAPEN_PNG } = SLIDES;

const { SHOW_SPLASH_SCREEN } = StorageService;

const Slide = styled.View`
  flex: 1;
  padding: 30px;
  background-color: #f5f5f5;
  justify-content: flex-end;
`;

const SlideText = styled(Text)`
  font-size: 18px;
  line-height: 23px;
`;

const SlideTextLarge = styled(Text)`
  font-size: 25px;
  line-height: 23px;
`;

const SlideImageContainer = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
`;

const Dot = styled.View`
  width: 15px;
  height: 15px;
  border-width: 2px;
  border-color: #610839;
  border-radius: 8px;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 3px;
  margin-bottom: 20px;
`;

const ActiveDot = styled.View`
  background-color: #610839;
  width: 15px;
  height: 15px;
  border-radius: 8px;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 3px;
  margin-bottom: 20px;
`;

const ButtonNextText = styled(Text)`
  font-size: 19px;
`;

const ButtonContainer = styled.View`
  padding-start: 25px;
  padding-end: 25px;
  padding-top: 35px;
`;

const EnhancedScreenWrapper = styled(ScreenWrapper)`
  padding: 0px;
`;

const Flex = styled.View`
  flex: ${props => (props.value ? props.value : 1)};
`;

const buttonWrapperStyle = {
  backgroundColor: 'transparent',
  flexDirection: 'row',
  paddingBottom: 25,
  paddingRight: 30,
  justifyContent: 'space-between',
  alignItems: 'flex-end',
};

/**
 * Splash screen that shall be displayed during first app initiation or after an app update.
 *
 * SHOW_SPLASH_SCREEN is a persistent variable that will route navigation
 * to ether AuthLoading or display splash screen.
 */
class SplashScreen extends Component {
  _panResponder = PanResponder.create({
    onPanResponderMove: (_evt, gestureState) => {
      const { swipeIndex, showSwipeInterface } = this.state;
      if (swipeIndex === 2 && showSwipeInterface === true) {
        if (gestureState.dx < 0) {
          this.setState({ showSwipeInterface: false });
        }
      }
    },
    onPanResponderRelease: (_evt, _gestureState) => {
      setTimeout(() => {
        const { swipeIndex } = this.state;
        if (swipeIndex <= 2) {
          this.setState({ showSwipeInterface: true });
        }
      }, 400);
    },
  });

  constructor(props) {
    super(props);

    this.state = {
      showSwipeInterface: true,
      swipeButtonText: 'Kom igång',
      swipeIndex: 0,
    };

    this.showSplash();
  }

  /**
   * Navigate to AuthLoading if splash screen disabled.
   */
  showSplash = () => {
    AsyncStorage.getItem(SHOW_SPLASH_SCREEN).then(value => {
      const {
        navigation: { navigate },
      } = this.props;
      let showSplash = true;
      if (value) showSplash = JSON.parse(value);

      if (!showSplash) {
        navigate('LoginScreen');
      }
    });
  };

  /**
   * Set state disable for splash screen.
   */
  disableSplash = () => {
    const {
      navigation: { navigate },
    } = this.props;

    AsyncStorage.setItem(SHOW_SPLASH_SCREEN, JSON.stringify(false));

    navigate('LoginScreen');
  };

  /**
   * Button for disabling splash screen.
   */
  ButtonDisableSplash = () => (
    <ButtonContainer>
      <Button onClick={() => this.disableSplash()} color="purpleLight" block>
        <Text>Logga in med Mobilt BankID</Text>
      </Button>
    </ButtonContainer>
  );

  swipeWelcome = () => (
    <Slide>
      <SlideImageContainer>
        <ImageBackground style={{ width: 130, height: 200 }} source={STADSVAPEN_PNG} />
      </SlideImageContainer>
      <Flex value="2">
        <Flex>
          <Heading type="h2">Mitt {'\n'}Helsingborg</Heading>
        </Flex>
        <Flex>
          <SlideTextLarge>Välkommen!</SlideTextLarge>
        </Flex>
      </Flex>
      <Flex />
    </Slide>
  );

  slideEasy = () => (
    <Slide>
      <SlideImageContainer>
        <ImageBackground source={SLIDE_001_PNG} style={{ width: 300, height: 300 }} />
      </SlideImageContainer>
      <Flex value="2">
        <Flex>
          <Heading type="h2">Enkelt</Heading>
        </Flex>

        <Flex value="2">
          <SlideText>
            Mitt Helsingborg är appen där du enkelt får tillgång till tjänster och information från
            kommunen.
          </SlideText>
        </Flex>
      </Flex>
      <Flex />
    </Slide>
  );

  slideAccessible = () => (
    <Slide>
      <SlideImageContainer>
        <ImageBackground source={SLIDE_002_PNG} style={{ width: 230, height: 260 }} />
      </SlideImageContainer>
      <Flex value="2">
        <Flex>
          <Heading type="h2">Nära</Heading>
        </Flex>

        <Flex value="2">
          <SlideText>
            Du kan följa och hantera dina ärenden, få personlig service eller bli tipsad om saker
            som händer nära dig.
          </SlideText>
        </Flex>
      </Flex>
      <Flex />
    </Slide>
  );

  slidePersonal = () => {
    const { ButtonDisableSplash } = this;
    return (
      <Slide>
        <SlideImageContainer>
          <ImageBackground source={SLIDE_003_PNG} style={{ width: 300, height: 300 }} />
        </SlideImageContainer>
        <Flex value="2">
          <Flex>
            <Heading type="h2">Personligt</Heading>
          </Flex>
          <Flex value="2">
            <SlideText>
              Inloggad ger mer. Som inloggad får du en personlig upplevelse anpassad för dig.
              {'\n\n'}
              Allt samlat i mobilen.
            </SlideText>
          </Flex>
        </Flex>

        <Flex>
          <ButtonDisableSplash />
        </Flex>
      </Slide>
    );
  };

  /**
   * Remove next buttons for last screen.
   */
  swipeAction = index => {
    if (index === 0) {
      this.setState({ swipeButtonText: 'Kom igång' });
    } else if (index === 2) {
      this.setState({ showSwipeInterface: true });
    } else if (index === 3) {
      this.setState({ showSwipeInterface: false });
    } else {
      // this.setState({ disableSwipeInterface: true })
      this.setState({ swipeButtonText: 'Nästa' });
    }

    this.setState({ swipeIndex: index });
  };

  swipeToNext = () => {
    const { swipeIndex } = this.state;
    this._swiper.scrollBy(1);

    if (swipeIndex === 2) {
      this.setState({ showSwipeInterface: false });
    }
  };

  render() {
    const { showSwipeInterface, swipeButtonText } = this.state;
    console.log('showSwipeInterface', showSwipeInterface);

    return (
      <EnhancedScreenWrapper>
        <Swiper
          {...this._panResponder.panHandlers}
          ref={swiper => {
            this._swiper = swiper;
          }}
          style={{ overflow: 'visible' }}
          buttonWrapperStyle={buttonWrapperStyle}
          showsPagination={showSwipeInterface}
          showsButtons={showSwipeInterface}
          prevButton={<Text></Text>}
          nextButton={
            <Button color="swipe" onClick={() => this.swipeToNext()}>
              <ButtonNextText>{swipeButtonText}</ButtonNextText>
              <Icon size={16} name="chevron-right" color="purple" />
            </Button>
          }
          dot={<Dot />}
          activeDot={<ActiveDot />}
          paginationStyle={{ paddingEnd: 195 }}
          onIndexChanged={index => this.swipeAction(index)}
          loop={false}
        >
          {this.swipeWelcome()}
          {this.slideEasy()}
          {this.slideAccessible()}
          {this.slidePersonal()}
        </Swiper>
      </EnhancedScreenWrapper>
    );
  }
}

SplashScreen.propTypes = {
  navigation: PropTypes.object,
};

export default SplashScreen;
