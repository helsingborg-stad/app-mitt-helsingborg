/**
 * @format
 */

import { View } from 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

// Note: test renderer must be required after react-native.

it('renders correctly', () => {
  renderer.create(<View>It renders</View>);
});
