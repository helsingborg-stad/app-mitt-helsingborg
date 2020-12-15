import React from 'react';
import { Dimensions, StyleSheet, Text, View, Image } from 'react-native';

const { width, height } = Dimensions.get('window');
export const SLIDE_HEIGHT = 0.61 * height;

const styles = StyleSheet.create({
  container: {
    width,
    paddingLeft: 58,
    paddingRight: 58,
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
    fontFamily: 'Roboto',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
    letterSpacing: 0.025,
    color: 'rgba(0, 33, 63, 0.64)',
    paddingTop: 38,
    fontFamily: 'Roboto',
  },
  subTitleHrRule: {
    borderBottomColor: 'rgba(0, 0, 0, 0.48)',
    borderBottomWidth: 2,
    width: 32,
    paddingTop: 16,
  },
  content: {
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 30,
    paddingTop: 16,
    textAlignVertical: 'top',
    fontFamily: 'Roboto',
  },
});

interface SliderProps {
  title: string;
  content: string;
  right: boolean;
  picture?: number;
}

const Slide = ({ title, content, picture }: SliderProps) => {
  const transform = [{ translateY: (SLIDE_HEIGHT - 300) / 2 }];

  return (
    <View style={[styles.container, { transform }]}>
      <View>
        <Text style={styles.subTitle}>Mitt Helsingborg</Text>
        <View style={styles.subTitleHrRule} />
      </View>
      <View style={styles.underlay}>
        {/* <Image source={picture} style={styles.picture} /> */}
        <Image
          source={picture}
          style={{
            alignSelf: 'center',
            height: '100%',
            width: '100%',
          }}
          resizeMode="cover"
        />
      </View>
      <View style={[styles.titleContent]}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View>
        <Text style={styles.content}>{content}</Text>
      </View>
    </View>
  );
};

export default Slide;
