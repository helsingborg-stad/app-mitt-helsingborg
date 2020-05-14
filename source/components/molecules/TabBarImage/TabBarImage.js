import React from 'react';
import { Image } from 'react-native-elements';
import PropTypes from 'prop-types';

const TabBarImage = src => () => <Image source={src} style={{ width: 25, height: 25 }} />;
TabBarImage.propTypes = {
  src: PropTypes.string,
};
export default TabBarImage;
