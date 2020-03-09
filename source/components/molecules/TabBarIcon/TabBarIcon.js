import React from 'react';
import { Icon } from 'react-native-elements';
// TODO: Move Badge to own component file
const TabBarIcon = (iconName, colorFocused) => ({ focused }) => (
  <Icon name={iconName} color={focused ? colorFocused : 'gray'} />
);

export default TabBarIcon;
