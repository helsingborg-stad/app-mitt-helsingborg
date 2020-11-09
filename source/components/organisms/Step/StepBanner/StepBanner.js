import React from 'react';
import { Image } from 'react-native';
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

const BannerImageWrapper = styled.View`
  height: 256px;
`;
const BannerImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const StepBanner = ({ style, imageSrc, colorSchema }) => (
  <BannerWrapper style={style} image={imageSrc} colorSchema={colorSchema}>
    {Object.prototype.hasOwnProperty.call(icons, imageSrc) ? (
      <BannerImageWrapper>
        <BannerImage resizeMode="contain" source={icons[imageSrc]} />
      </BannerImageWrapper>
    ) : null}
  </BannerWrapper>
);

StepBanner.propTypes = {
  /**
   * The source to a image to render as a background in the banner.
   */
  imageSrc: PropTypes.string,
  /**
   * The React Native style property. This is optional and might override the colorSchema.
   */
  style: PropTypes.array,
  /**
   * The color schema that the component should apply, colors are retrived from ThemeProvider
   */
  colorSchema: PropTypes.oneOf(['blue', 'red', 'purple', 'green']),
};
StepBanner.defaultProps = {
  imageSrc: undefined,
  colorSchema: 'blue',
  style: [],
};
export default StepBanner;
