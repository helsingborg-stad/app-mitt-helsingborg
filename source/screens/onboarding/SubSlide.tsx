import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Button from './components/Button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 44,
  },
  subtitle: {
    fontSize: 24,
    lineHeight: 30,
    marginBottom: 12,
    color: '#0C0D34',
    textAlign: 'center',
  },
  description: {
    fontFamily: ' ',
    fontSize: 16,
    lineHeight: 24,
    color: '#0C0D34',
    textAlign: 'center',
    marginBottom: 40,
  },
});

interface SubSlideProps {
  subtitle: string;
  last?: boolean;
  onPress: () => void;
}

const SubSlide = ({ subtitle, last, onPress }: SubSlideProps) => (
  <View style={styles.container}>
    <Text style={styles.subtitle}>{subtitle}</Text>
    <Button
      onPress={onPress}
      label={last ? 'Login' : 'Fortsätt'}
      variant={last ? 'primary' : 'default'}
    />
  </View>
);

export default SubSlide;
