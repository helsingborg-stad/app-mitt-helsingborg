import React, { useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { divide, multiply } from 'react-native-reanimated';
import { interpolateColor, useScrollHandler } from 'react-native-redash';

import Slide, { SLIDE_HEIGHT } from './Slide';
import SubSlide from './SubSlide';
import Dot from './Dot';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  slider: {
    flex: 0.61 * 2,
  },
  footer: {
    flex: 1,
  },
  footerContent: {
    flex: 1,
  },
  pagination: {
    ...StyleSheet.absoluteFillObject,
    height: 75,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  const scroll = useRef<Animated.ScrollView>(null);
  const { scrollHandler, x } = useScrollHandler();
  const backgroundColor = interpolateColor(x, {
    inputRange: slides.map((_, i) => i * width),
    outputRange: slides.map(slide => slide.color),
  });
  // const transform = [{ translateX: 50 }];
  const transform = [
    // { translateY: (50 - 100) / 2 },
    // { translateX: false ? width / 2 - 50 : -width / 2 + 50 },
    // { rotate: false ? '-90deg' : '90deg' },
    { translateX: height - 50 },
  ];

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
        <Animated.View style={[styles.footerContent]}>
          <View style={styles.pagination}>
            {slides.map((_, index) => (
              <Dot key={index} currentIndex={divide(x, width)} {...{ index }} />
            ))}
          </View>

          <Animated.View
            style={{
              flex: 1,
              flexDirection: 'row',
              width: width * slides.length,
              transform: [{ translateX: multiply(x, -1) }],
            }}
          >
            {slides.map(({ subtitle }, index) => (
              <SubSlide
                key={index}
                onPress={() => {
                  if (scroll.current) {
                    scroll.current.getNode().scrollTo({ x: width * (index + 1), animated: true });
                  }
                }}
                last={index === slides.length - 1}
                {...{ subtitle }}
              />
            ))}
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
};

export default Onboarding;
