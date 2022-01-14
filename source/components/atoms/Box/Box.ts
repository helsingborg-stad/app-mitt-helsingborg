import PropTypes from 'prop-types';
import styled from 'styled-components/native';

const Box = styled.View`
  height: ${props => props.height || 'auto'};
  width: ${props => props.width || 'auto'};

  border-radius: ${props => props.borderRadius || '0'};
  border-style: solid;

  ${({ borderColor }) => borderColor && `
    border-color: ${borderColor};
  `}

  ${({ borderWidth }) => borderWidth && `
    border-width: ${borderWidth};
  `}

  ${({ theme, colorSchema }) => colorSchema && theme && `
    background: ${theme.colors.complementary[colorSchema][0]};
  `}

  ${({ bg }) => bg && `
    background: ${bg};
  `}

  ${props => props.p && `
    padding: ${props.p};
  `}

  ${props => props.py && `
    padding-top: ${props.py};
    padding-bottom: ${props.py};
  `}

  ${props => props.px && `
    padding-top: ${props.px};
    padding-bottom: ${props.px};
  `}

  ${props => props.pt && `
    padding-top: ${props.pt};
  `}

  ${props => props.pr && `
    padding-right: ${props.pr};
  `}

  ${props => props.pb && `
    padding-bottom: ${props.pb};
  `}

  ${props => props.pl && `
    padding-left: ${props.pl};
  `}

  ${props => props.m && `
   margin: ${props.m};
  `}

  ${props => props.my && `
    margin-top: ${props.my};
    margin-bottom: ${props.my};
  `}

  ${props => props.mx && `
    margin-top: ${props.mx};
    margin-bottom: ${props.mx};
  `}

  ${props => props.mt && `
    margin-top: ${props.mt};
  `}

  ${props => props.mr && `
    margin-right: ${props.mr};
  `}

  ${props => props.mb && `
    margin-bottom: ${props.mb};
  `}

  ${props => props.ml && `
    margin-left: ${props.ml};
  `}
`;



Box.propTypes = {

  /**
   * The width of the box.
   */
  width: PropTypes.string,

  /**
   * The height of the box.
   */
  height: PropTypes.string,

  /**
   * The height of the box.
   */
  borderRadius: PropTypes.string,

  /**
   * Value for setting the top, right, bottom and left padding
   */
  p: PropTypes.string,

  /**
   * Value for setting the top and bottom padding;
   */
  py: PropTypes.string,

  /**
   * Value for setting the left and right padding;
   */
  px: PropTypes.string,

  /**
   * Value for setting the top padding.
   */
  pt: PropTypes.string,

  /**
   * Value for setting the right padding.
   */
  pr: PropTypes.string,

  /**
   * Value for setting the left padding.
   */
  pl: PropTypes.string,

  /**
   * Value for setting the bottom padding.
   */
  pb: PropTypes.string,

  /**
   * Value for setting the top, right, bottom, and left margin
   */
  m: PropTypes.string,

  /**
   * Value for setting the top and bottom margin
   */
  my: PropTypes.string,

  /**
   * Value for setting the left and right margin.
   */
  mx: PropTypes.string,

  /**
   * Value for setting the top margin
   */
  mt: PropTypes.string,

  /**
   * Value for setting the right margin
   */
  mr: PropTypes.string,

  /**
   * Value for setting the bottom margin
   */
  mb: PropTypes.string,

  /**
   * Value for setting the left margin
   */
  ml: PropTypes.string,

  /**
   * The background of the box. Overrides the colorSchema.
   */
  bg: PropTypes.string,

  /**
   * The color schema of the box. can be blue, purple, green or red.
   */
  colorSchema: PropTypes.oneOf(['blue', 'green', 'purple', 'red']),

  /**
   * The width of the box border.
   */
  borderWidth: PropTypes.string,

  /**
   * The style of the border solid, dotted etc.
   */

  borderStyle: PropTypes.string,

  /**
   * The color of the border.
   */
  borderColor: PropTypes.string
};

export default Box;
