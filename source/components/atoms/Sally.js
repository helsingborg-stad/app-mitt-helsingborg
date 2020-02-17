import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Sally = () => (
  <View style={styles.sally}>
    <Text style={styles.sallyText}>Sally</Text>
  </View>
);

export default Sally;

const styles = StyleSheet.create({
  sally: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: 'darkorange',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: { height: 3, width: 2 },
  },
  sallyText: {
    color: 'white',
  },
});
