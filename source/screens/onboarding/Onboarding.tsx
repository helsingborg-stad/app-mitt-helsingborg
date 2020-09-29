import React, { useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { multiply } from 'react-native-reanimated';
import { interpolateColor, useScrollHandler } from 'react-native-redash';

import Slide from './Slide';
import SubSlide from './SubSlide';

const { width } = Dimensions.get('window');

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
  },
});

const slides = [
  {
    title: 'Relaxed',
    subtitle: 'Relaxed subtitle',
    description: 'Always relaxed',
    color: '#BFEAF5',
  },
  {
    title: 'Smooth',
    description: 'Always smooth',
    color: '#BEECC4',
  },
  {
    title: 'Slow',
    description: 'Always slow',
    color: '#FFE4D9',
  },
];

const Onboarding = () => {
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
          {...scrollHandler}
        >
          {slides.map(({ title }, index) => (
            <Slide key={index} {...{ title }} />
          ))}
        </Animated.ScrollView>
      </Animated.View>
      <View style={styles.footer}>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor,
          }}
        >
          <Animated.View
            style={{
              flex: 1,
              flexDirection: 'row',
              width: width * slides.length,
              transform: [{ translateX: multiply(x, -1) }],
            }}
          >
            {slides.map(({ subtitle, description }, index) => (
              <SubSlide
                key={index}
                onPress={() => {
                  if (scroll.current) {
                    scroll.current.getNode().scrollTo({ x: width * (index + 1), animated: true });
                  }
                }}
                last={index === slides.length - 1}
                {...{ subtitle, description }}
              />
            ))}
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
};

export default Onboarding;
