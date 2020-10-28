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
  background-color: ${props =>
    props.backgroundColor
      ? props.backgroundColor
      : props.theme.colors.complementary[props.colorSchema][0]};
  position: relative;
  justify-content: flex-end;
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

const Banner = ({ style, currentPosition, totalStepNumber, imageSrc, colorSchema }) => (
  <BannerWrapper style={style} image={imageSrc} colorSchema={colorSchema}>
    {Object.prototype.hasOwnProperty.call(icons, imageSrc) ? (
      <BannerImageWrapper>
        <BannerImage resizeMode="contain" source={icons[imageSrc]} />
      </BannerImageWrapper>
    ) : null}
    {/*
        TODO: Move ProgressCounterText component out of the banner component.
        Could be rendered as a child in the Banner instead where it's needed. ie in a Step.
      */}
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
  /**
   * The source to a image to render as a background in the banner.
   */
  imageSrc: PropTypes.string,
  /**
   * The React Native style property. This is optional and might override the colorSchema.
   */
  style: PropTypes.string,
  /**
   * The color schema that the component should apply, colors are retrived from ThemeProvider
   */
  colorSchema: PropTypes.oneOf(['blue', 'red', 'purple', 'green']),
};
Banner.defaultProps = {
  imageSrc: undefined,
  colorSchema: 'blue',
  style: {},
};
export default Banner;
