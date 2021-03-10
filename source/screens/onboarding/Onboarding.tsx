import React, { useRef, useState } from 'react';
import { Platform, Dimensions, StatusBar, View } from 'react-native';
import Animated, { divide } from 'react-native-reanimated';
import { useScrollHandler, interpolateColor } from 'react-native-redash';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-community/async-storage';

import { SHOW_SPLASH_SCREEN } from '../../services/StorageService';
import Slide from './Slide';
import Dot from './Dot';
import Button from './components/Button';

const SLIDE_BACKGROUND_ANSOKAN = require('../../assets/images/slides/onboarding_02_ansokan_in_3x.png');
const SLIDE_BACKGROUND_ARENDEN = require('../../assets/images/slides/onboarding_03_arenden_in_3x.png');
const SLIDE_BACKGROUND_KONTAKT = require('../../assets/images/slides/onboarding_04_kontakt_in_3x.png');

const { width } = Dimensions.get('window');

const OnboardingContainer = styled.View`
  flex: 1;
`;

const AnimatedScrollContainer = styled(Animated.View)`
  flex: 6;
`;

const FooterContainer = styled.View`
  flex: 1;
`;

const AnimatedFooterBackground = styled(Animated.View)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const FooterContent = styled.View`
  flex: 1;
  flex-direction: row;
  padding-top: 10px;
`;

const FooterPagination = styled.View`
  padding: 10px 0 0 40px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const SliderContinueButtonContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  padding-right: 48px;
`;

const slides = [
  {
    headingColor: '#003359',
    title: 'Gör ansökan för ekonomiskt bistånd',
    content: '',
    color: '#E4EBF0',
    picture: SLIDE_BACKGROUND_ANSOKAN,
  },
  {
    headingColor: '#770000',
    title: 'Följ status för ansökan',
    content: '',
    color: '#F5E4E3',
    picture: SLIDE_BACKGROUND_ARENDEN,
  },
  {
    headingColor: '#4B0034',
    title: 'Kontakta din handläggare',
    content: '',
    color: '#E8DAE4',
    picture: SLIDE_BACKGROUND_KONTAKT,
  },
];

const disableOnboarding = async () => {
  await AsyncStorage.setItem(SHOW_SPLASH_SCREEN, JSON.stringify(false));
};

const navigationResetToLoginScreen = (navigation) => {
  disableOnboarding().then(
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    })
  );
};

interface OnboardingPropsInterface {
  navigation: () => {};
}

const Onboarding = ({ navigation }: OnboardingPropsInterface) => {
  const [scrollPos, setScrollPos] = useState(0);
  const scroll = useRef<Animated.ScrollView>(null);
  const { scrollHandler, x } = useScrollHandler();
  const backgroundColor = interpolateColor(x, {
    inputRange: slides.map((_, i) => i * width),
    outputRange: slides.map((slide) => slide.color),
  });
  const lastScrollPos = width * (slides.length - 2);

  return (
    <OnboardingContainer>
      <StatusBar hidden />
      <AnimatedScrollContainer backgroundColor={backgroundColor}>
        <Animated.ScrollView
          ref={scroll}
          horizontal
          snapToInterval={width}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onMomentumScrollEnd={(event) => {
            setScrollPos(event.nativeEvent.contentOffset.x);
          }}
          {...scrollHandler}
        >
          {slides.map(({ headingColor, title, content, picture }, index) => (
            <Slide key={index} {...{ headingColor, title, content, picture }} />
          ))}
        </Animated.ScrollView>
      </AnimatedScrollContainer>
      <FooterContainer>
        <AnimatedFooterBackground backgroundColor={backgroundColor} />
        <FooterContent>
          <View>
            <FooterPagination>
              {slides.map((_, index) => (
                <Dot key={index} currentIndex={divide(x, width)} {...{ index }} />
              ))}
            </FooterPagination>
          </View>
          <SliderContinueButtonContainer>
            <Button
              label={scrollPos <= lastScrollPos ? 'Fortsätt' : 'Logga in'}
              onPress={() => {
                if (scrollPos <= lastScrollPos) {
                  if (Platform.OS === 'android') {
                    // Fix for Android bug where onMomentumScrollEnd not called when setting scroll with scrollTo.
                    setScrollPos(scrollPos + width);
                  }

                  scroll.current.getNode().scrollTo({ x: width + scrollPos, animated: true });
                } else {
                  navigationResetToLoginScreen(navigation);
                }
              }}
            />
          </SliderContinueButtonContainer>
        </FooterContent>
      </FooterContainer>
    </OnboardingContainer>
  );
};

export default Onboarding;
