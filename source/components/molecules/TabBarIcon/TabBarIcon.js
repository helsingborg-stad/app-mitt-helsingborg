import React from 'react';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';

// TODO: Move Badge to own component file
const TabBarIcon = (iconName, colorFocused) => ({ focused }) => (
  <Icon name={iconName} color={focused ? colorFocused : 'gray'} />
);

TabBarIcon.propTypes = {
  focused: PropTypes.bool,
};

TabBarIcon.defaultProps = {
  focused: false,
};

export default TabBarIcon;
