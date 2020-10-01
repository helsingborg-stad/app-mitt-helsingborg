import React from 'react';
import { Dimensions, StyleSheet, Text, View, Image } from 'react-native';

const { width, height } = Dimensions.get('window');
export const SLIDE_HEIGHT = 0.61 * height;

const styles = StyleSheet.create({
  container: {
    width,
  },
  underlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  picture: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  titleContent: {
    height: 100,
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '800',
    color: '#00213F',
    textAlign: 'left',
    paddingLeft: 58,
  },
});

interface SliderProps {
  title: string;
  right: boolean;
}

const Slide = ({ title, right }: SliderProps) => {
  // const transform = [{ translateY: (SLIDE_HEIGHT - 100) / 2 }];
  const transform = [
    { translateY: SLIDE_HEIGHT / 2 },
    // { translateX: right ? width / 2 - 50 : -width / 2 + 50 },
    // { rotate: right ? '-90deg' : '90deg' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.underlay}>{/* <Image source={picture} style={styles.picture} /> */}</View>
      <View style={[styles.titleContent, { transform }]}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

export default Slide;
