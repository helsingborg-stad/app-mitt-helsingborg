import styled from 'styled-components/native';
import React from 'react';
import PropTypes from 'prop-types';
import Text from '../Text';
import colors from '../../../styles/colors';

const sizes = {
  small: {
    font: '12px',
    paddingBottom: '3px',
    lineWidth: '2px',
  },
  medium: {
    font: '14px',
    paddingBottom: '7px',
    lineWidth: '3px',
  },
  large: {
    font: '18px',
    paddingBottom: '10px',
    lineWidth: '4px',
  },
};

const FieldLabelText = styled(Text)`
  font-size: ${props => sizes[props.size].font};
  color: ${props => colors.fieldLabel[props.color].text};
  text-transform: uppercase;
  font-weight: bold;
  padding-bottom: 7px;
  padding-top: 5px;
`;
const FieldLabelBorder = styled.View`
  padding-bottom: ${props => sizes[props.size].paddingBottom};
  border-bottom-color: ${props => colors.fieldLabel[props.color].underline};
  border-bottom-width: ${props => {
    if (props.underline === 'false') {
      return '0px';
    }
    return sizes[props.size].lineWidth;
  }};
  align-self: flex-start;
`;

/**
 * Simple label for field inputs, that styles the text to all-caps and optionally puts a line under.
 * @param {*} props 
 */
const FieldLabel = props => {
  const { size, color, underline, style, ...other } = props;
  return (
    <FieldLabelBorder size={size} color={color} underline={underline}>
      <FieldLabelText underline={underline} size={size} color={color} style={style}>
        {other.children}
      </FieldLabelText>
    </FieldLabelBorder>
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
  color: PropTypes.oneOf(Object.keys(colors.fieldLabel)),
  /**
   * Set a size, one of small, medium, large.
   */
  size: PropTypes.oneOf(Object.keys(sizes)),
  /**
   * Any additional styling of the text component.
   */
  style: PropTypes.array,
};

FieldLabel.defaultProps = {
  underline: true,
  color: 'light',
  size: 'medium',
};
export default FieldLabel;
