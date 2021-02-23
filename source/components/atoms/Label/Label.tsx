import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import HelpButton from '../../molecules/HelpButton';
import Text from '../Text';
import theme from '../../../styles/theme';
import { StyleProp, TextStyle } from 'react-native';
import { PrimaryColor, getValidColorSchema } from '../../../styles/themeHelpers';

const LabelText = styled(Text)<{size: 'small' | 'medium' | 'large'; color: PrimaryColor }>`
  font-size: ${props => props.theme.label[props.size].font}px;
  color: ${props => props.theme.label.colors[props.color].text};
  text-transform: uppercase;
  font-weight: bold;
  padding-bottom: 8px;
  padding-top: 4px;
`;
const LabelBorder = styled.View<{size: 'small' | 'medium' | 'large'; color: PrimaryColor; underline?: boolean; }>`
  padding-bottom: ${props => {
    if (props.underline === false)
      return 0;  
    return props.theme.label[props.size].paddingBottom;
  }}px;
  border-bottom-color: ${props => props.theme.label.colors[props.color].underline};
  border-bottom-width: ${props => {
    if (props.underline === false) {
      return 0;
    }
    return theme.label[props.size].lineWidth;
  }}px;
  margin-bottom: ${props => {
    if (props.underline === false) {
      return 0;
    }
    return theme.label[props.size].marginBottom;
  }}px;
  align-self: flex-start;
  margin-right: 8px;
`;
const LabelContainer = styled.View`
  flex-direction: row;
  padding-right: 10px;
  justify-content: center;
`;
const LabelWrapper = styled.View`
  flex: auto;
`;
const HelpWrapper = styled.View`
  flex: auto;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 22px;
`;

interface Props {
  size?: 'small' | 'medium' | 'large';
  colorSchema?: PrimaryColor;
  underline?: boolean;
  style: StyleProp<TextStyle>;
  help?: { text: string; size?: number; heading?: string; tagline?: string; url?: string };
}

/**
 * Simple label for field inputs, that styles the text to all-caps, bold and optionally puts a line under.
 * Use like a Text component.
 */
const Label: React.FC<Props> = ({ size, colorSchema, underline, style, help, ...other } ) => {
  const validColorSchema = getValidColorSchema(colorSchema);
  return (
    <LabelContainer>
      <LabelWrapper>
      <LabelBorder size={size} color={validColorSchema} underline={underline}>
        <LabelText size={size} color={validColorSchema} style={style}>
          {other.children}
        </LabelText>
      </LabelBorder>
      </LabelWrapper>
      {help && Object.keys(help).length > 0 && <HelpWrapper><HelpButton {...help} /></HelpWrapper>}
    </LabelContainer>
  );
};

Label.propTypes = {
  /**
   * If false, disables the line under the label. True by default.
   */
  underline: PropTypes.bool,
  /**
   * Set a color theme which changes the text color and line color accordingly. 'light' is default.
   */
  colorSchema: PropTypes.oneOf(Object.keys(theme.colors.primary)),
  /**
   * Set a size, one of small, medium, large.
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * Any additional styling of the text component.
   */
  style: PropTypes.any,
  /**
   * Show an help button
   */
  help: PropTypes.shape({
    text: PropTypes.string,
    size: PropTypes.number,
    heading: PropTypes.string,
    tagline: PropTypes.string,
    url: PropTypes.string,
  }),
};

Label.defaultProps = {
  underline: true,
  colorSchema: 'blue',
  size: 'medium',
};

export default Label;
