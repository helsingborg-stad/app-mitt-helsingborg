import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Button from './components/Button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  subtitle: {
    fontSize: 24,
    lineHeight: 30,
    marginBottom: 12,
    color: '#0C0D34',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#0C0D34',
    textAlign: 'center',
    marginBottom: 40,
  },
});

interface OnboardingFooterProps {
  last?: boolean;
  width: number;
  transform: number;
  onPress: () => void;
}

const OnboardingFooter = ({ subtitle, last, onPress }: OnboardingFooterProps) => (
  <View style={styles.container}>
    <Button
      onPress={onPress}
      label={last ? 'Login' : 'Fortsätt'}
      variant={last ? 'primary' : 'default'}
    />
  </View>
);

export default OnboardingFooter;
