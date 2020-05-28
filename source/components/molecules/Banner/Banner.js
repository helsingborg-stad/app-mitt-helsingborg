import React from 'react';
import { Image } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ImageWrapper = styled.View(props => ({
  top: 0,
  margin: 0,
  padding: 0,
  height: props.height,
  backgroundColor: props.backgroundColor,
}));

const Banner = ({ image, backgroundColor, height, style }) => (
  <ImageWrapper backgroundColor={backgroundColor} height={height}>
    <Image source={image} style={style} />
  </ImageWrapper>
);

Banner.propTypes = {
  image: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
  height: PropTypes.string,
  style: PropTypes.object.isRequired,
};
Banner.defaultProps = {
  backgroundColor: '#FBF7F0',
  height: '35%',
};
export default Banner;
