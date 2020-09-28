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
    fontSize: 80,
    lineHeight: 80,
    color: 'white',
    textAlign: 'center',
  },
});

interface SliderProps {
  title: string;
}

const Slide = ({ title }: SliderProps) => {
  const transform = [{ translateY: (SLIDE_HEIGHT - 100) / 2 }];
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
