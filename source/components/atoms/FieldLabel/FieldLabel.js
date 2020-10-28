import styled from 'styled-components/native';
import React from 'react';
import PropTypes from 'prop-types';
import { HelpButton } from 'source/components/molecules';
import Text from '../Text';
import theme from '../../../styles/theme';

// TODO: THEME/STYLING MOVE SIZES TO THEME DECALRATION in theme.js
const sizes = {
  small: {
    font: '12px',
    paddingBottom: '3px',
    lineWidth: '2px',
    marginBottom: '6px',
  },
  medium: {
    font: '14px',
    paddingBottom: '7px',
    lineWidth: '3px',
    marginBottom: '12px',
  },
  large: {
    font: '18px',
    paddingBottom: '10px',
    lineWidth: '4px',
    marginBottom: '18px',
  },
};

const FieldLabelText = styled(Text)`
  font-size: ${props => sizes[props.size].font};
  color: ${props => theme.fieldLabel[props.color].text};
  text-transform: uppercase;
  font-weight: bold;
  padding-bottom: 7px;
  padding-top: 5px;
`;
const FieldLabelBorder = styled.View`
  padding-bottom: ${props => sizes[props.size].paddingBottom};
  border-bottom-color: ${props => theme.fieldLabel[props.color].underline};
  border-bottom-width: ${props => {
    if (props.underline === false) {
      return '0px';
    }
    return sizes[props.size].lineWidth;
  }};
  margin-bottom: ${props => {
    if (props.underline === false) {
      return '0px';
    }
    return sizes[props.size].marginBottom;
  }};
  align-self: flex-start;
  margin-right: 8px;
`;

const FieldLabelContainer = styled.View`
  flex-direction: row;
`;

/**
 * Simple label for field inputs, that styles the text to all-caps, bold and optionally puts a line under.
 * Use like a Text component.
 * @param {*} props
 */
const FieldLabel = props => {
  const { size, color, underline, style, help, ...other } = props;

  return (
    <FieldLabelContainer>
      <FieldLabelBorder size={size} color={color} underline={underline}>
        <FieldLabelText underline={underline} size={size} color={color} style={style}>
          {other.children}
        </FieldLabelText>
      </FieldLabelBorder>
      {Object.keys(help).length > 0 && <HelpButton {...help} />}
    </FieldLabelContainer>
  );
};

FieldLabel.propTypes = {
  /**
   * If false, disables the line under the label. True by default.
   */
  underline: PropTypes.bool,
  /**
   * Set a color theme which changes the text color and line color accordingly. 'light' is default.
   */
  color: PropTypes.oneOf(Object.keys(theme.fieldLabel)),
  /**
   * Set a size, one of small, medium, large.
   */
  size: PropTypes.oneOf(Object.keys(sizes)),
  /**
   * Any additional styling of the text component.
   */
  style: PropTypes.array,
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

FieldLabel.defaultProps = {
  underline: true,
  color: 'light',
  size: 'medium',
  help: {},
};

export default FieldLabel;
