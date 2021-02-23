import React, { useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View, Text } from 'react-native';
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  slider: {
    flex: 6,
  },
  footer: {
    flex: 1,
  },
  footerContent: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 20,
  },
  pagination: {
    paddingLeft: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  slideButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 58,
  },
});

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

const Onboarding = (props) => {
  const [scrollPos, setScrollPos] = useState(0);
  const scroll = useRef<Animated.ScrollView>(null);
  const { scrollHandler, x } = useScrollHandler();
  const backgroundColor = interpolateColor(x, {
    inputRange: slides.map((_, i) => i * width),
    outputRange: slides.map(slide => slide.color),
  });
  const lastScrollPos = width * (slides.length - 2);
  const { navigation } = props;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.slider, { backgroundColor }]}>
        <Animated.ScrollView
          ref={scroll}
          horizontal
          snapToInterval={width}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onMomentumScrollEnd={event => {
            setScrollPos(event.nativeEvent.contentOffset.x);
          }}
          {...scrollHandler}
        >
          {slides.map(({ title, content }, index) => (
            <Slide key={index} right={!!(index % 2)} {...{ title, content }} />
          ))}
        </Animated.ScrollView>
      </Animated.View>
      <View style={styles.footer}>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor,
          }}
        />
        <View style={styles.footerContent}>
          <View>
            <View style={styles.pagination}>
              {slides.map((_, index) => (
                <Dot key={index} currentIndex={divide(x, width)} {...{ index }} />
              ))}
            </View>
          </View>
          <View style={styles.slideButtonContainer}>
            <Button
              label={scrollPos <= lastScrollPos ? 'Fortsätt' : 'Logga in'}
              onPress={() => {
                if (scrollPos <= lastScrollPos) {
                  scroll.current.getNode().scrollTo({ x: width + scrollPos, animated: true });
                } else {
                  navigationResetToLoginScreen(navigation);
                }
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Onboarding;
