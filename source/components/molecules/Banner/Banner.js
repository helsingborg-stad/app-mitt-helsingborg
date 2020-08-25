import React from 'react';
import { Image } from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import icons from 'source/helpers/Icons';

const BannerWrapper = styled.View`
  margin: 0;
  padding: 0;
  min-height: ${props => (props.image ? '256px' : '192px')};
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
  height: 256px;
`;
const BannerImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const Banner = ({ imageSrc, iconSrc, backgroundColor, style }) => (
  <BannerWrapper
    image={imageSrc}
    style={style}
    backgroundColor={backgroundColor && backgroundColor !== '' ? backgroundColor : 'white'}
  >
    {imageSrc ? (
      <BannerImageWrapper>
        <BannerImage
          resizeMode="contain"
          source={Object.prototype.hasOwnProperty.call(icons, imageSrc) ? icons[imageSrc] : ''}
        />
      </BannerImageWrapper>
    ) : null}
    <BannerImageIcon
      source={Object.prototype.hasOwnProperty.call(icons, iconSrc) ? icons[iconSrc] : ''}
    />
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
