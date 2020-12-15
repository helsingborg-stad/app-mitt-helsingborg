import React, { useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { divide } from 'react-native-reanimated';
import { interpolateColor, useScrollHandler } from 'react-native-redash';

import Slide from './Slide';
import Dot from './Dot';
import Button from './components/Button';

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
    title: 'Mitt Helsingborg',
    color: '#FBF7F0',
  },
  {
    title: 'Ställ frågor',
    content: 'Undrar du något eller behöver hjälp?',
    color: '#F2E5CF',
  },
  {
    title: 'Gör ansökan',
    content: 'Vill du ansöka om bl.a. Bygglov, Ekonomiskt bistånd eller busskort till barnen.',
    color: '#D0D9DC',
  },
  {
    title: 'Hantera ärenden',
    content: 'Se status eller ändra i pågående ärenden.',
    color: '#F4D3CE',
  },
  {
    title: 'Kontakt med handläggare',
    content: 'Få personliga uppdateringar och ställ frågor direkt till rätt tjänsteperson.',
    color: '#DBECE0',
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
  const lastScrollPos = width * (slides.length - 2);

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
                  // TODO: Add navigation to login page.
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
