import React, { useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, { divide, multiply } from 'react-native-reanimated';
import { interpolateColor, useScrollHandler } from 'react-native-redash';

import Slide, { SLIDE_HEIGHT } from './Slide';
import SubSlide from './SubSlide';
import Dot from './Dot';
import OnboardingFooter from './OnboardingFooter';
import Button from './components/Button';

const { width, height } = Dimensions.get('window');

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
    title: 'Mitt Helsingborg',
    color: '#FBF7F0',
    picture: require('./assets/0.png'),
  },
  {
    title: 'Ställ frågor',
    content: 'Undrar du något eller behöver hjälp?',
    color: '#F2E5CF',
    picture: require('./assets/1.png'),
  },
  {
    title: 'Gör ansökan',
    content: 'Vill du ansöka om bl.a. Bygglov, Ekonomiskt bistånd eller busskort till barnen.',
    color: '#D0D9DC',
    picture: require('./assets/311.png'),
  },
  {
    title: 'Hantera ärenden',
    content: 'Se status eller ändra i pågående ärenden.',
    color: '#F4D3CE',
    picture: require('./assets/41.png'),
  },
  {
    title: 'Kontakt med handläggare',
    content: 'Få personliga uppdateringar och ställ frågor direkt till rätt tjänsteperson.',
    color: '#DBECE0',
    picture: require('./assets/0.png'),
  },
];

const Onboarding = () => {
  const [scrollPos, setScrollPos] = useState(0);
  const scroll = useRef<Animated.ScrollView>(null);
  const { scrollHandler, x } = useScrollHandler();
  const backgroundColor = interpolateColor(x, {
    inputRange: slides.map((_, i) => i * width),
    outputRange: slides.map(slide => slide.color),
  });

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
          {slides.map(({ title, picture, content }, index) => (
            <Slide key={index} right={!!(index % 2)} {...{ title, picture, content }} />
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
        <View style={{ flex: 1, flexDirection: 'row', paddingTop: 20 }}>
          <View>
            <View style={styles.pagination}>
              {slides.map((_, index) => (
                <Dot key={index} currentIndex={divide(x, width)} {...{ index }} />
              ))}
            </View>
          </View>
          <View style={styles.slideButtonContainer}>
            <Button
              label="Fortsätt"
              onPress={() => {
                // TODO: Check if last slade before scrolling.
                scroll.current.getNode().scrollTo({ x: width + scrollPos, animated: true });
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Onboarding;
