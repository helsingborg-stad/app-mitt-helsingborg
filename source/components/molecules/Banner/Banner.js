import React from 'react';
import { Image } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const BannerWrapper = styled.View`
  top: 0;
  margin: 0;
  padding: 0;
  min-height: ${props => (props.image ? '256' : '192')}px;
  background: ${props => props.backgroundColor};
  position: relative;
  justify-content: flex-end;
`;

const BannerImageIcon = styled(Image)`
  width: 72px;
  position: absolute;
  bottom: -37px;
  left: 32px;
`;

const BannerImageWrapper = styled.View`
  overflow: hidden;
  position: relative;
  bottom: 0;
  right: 0;
  left: 0;
  height: auto;
`;
const BannerImage = styled(Image)`
  width: 100%;
  height: 256px;
`;

const Banner = ({ imageSrc, iconSrc, backgroundColor, style }) => (
  <BannerWrapper image={imageSrc} style={style} backgroundColor={backgroundColor}>
    {imageSrc && (
      <BannerImageWrapper>
        <BannerImage resizeMode="contain" source={imageSrc} />
      </BannerImageWrapper>
    )}
    <BannerImageIcon source={iconSrc} />
  </BannerWrapper>
);

Banner.propTypes = {
  imageSrc: PropTypes.string,
  iconSrc: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
  style: PropTypes.object.isRequired,
};
Banner.defaultProps = {
  imageSrc: undefined,
  backgroundColor: '#FBF7F0',
};
export default Banner;
