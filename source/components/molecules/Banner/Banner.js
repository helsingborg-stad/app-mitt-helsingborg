import React from 'react';
import { Image } from 'react-native';
import { Text } from 'source/components/atoms';
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

const ProgressCounterText = styled(Text)`
  position: absolute;
  bottom: -37px;
  right: 32px;
`;

const BannerImageWrapper = styled.View`
  height: 256px;
`;
const BannerImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const Banner = ({
  currentPosition,
  totalStepNumber,
  imageSrc,
  iconSrc,
  backgroundColor,
  style,
}) => (
  <BannerWrapper
    image={imageSrc}
    style={style}
    backgroundColor={backgroundColor && backgroundColor !== '' ? backgroundColor : 'white'}
  >
    {Object.prototype.hasOwnProperty.call(icons, imageSrc) ? (
      <BannerImageWrapper>
        <BannerImage resizeMode="contain" source={icons[imageSrc]} />
      </BannerImageWrapper>
    ) : null}

    {Object.prototype.hasOwnProperty.call(icons, iconSrc) ? (
      <BannerImageIcon source={icons[iconSrc]} />
    ) : null}
    {totalStepNumber > 1 && currentPosition.level === 0 && (
      <ProgressCounterText>
        Steg {currentPosition.currentMainStep}/{totalStepNumber}
      </ProgressCounterText>
    )}
  </BannerWrapper>
);

Banner.propTypes = {
  /** The current position in the form */
  currentPosition: PropTypes.shape({
    index: PropTypes.number,
    level: PropTypes.number,
    currentMainStep: PropTypes.number,
  }),
  totalStepNumber: PropTypes.number,
  imageSrc: PropTypes.string,
  iconSrc: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
  style: PropTypes.array.isRequired,
};
Banner.defaultProps = {
  imageSrc: undefined,
  backgroundColor: '#FBF7F0',
};
export default Banner;
