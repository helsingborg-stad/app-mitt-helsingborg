import styled from 'styled-components/native';
import React from 'react'; 
import PropTypes from 'prop-types';
import Text from '../Text';
import colors from '../../../styles/colors';
import SHADOW from '../../../styles/shadow';

const FieldLabelText = styled(Text)`
  font-size: ${props => {
    if (props.size === 'small') { return '12px'; }
    if (props.size === 'large') { return '18px';}
    return '14px';
  }};
  text-transform: uppercase;
  font-weight: bold;
  padding-bottom: 7px;
  padding-top: 5px;
`;
const FieldLabelBorder = styled.View`
  padding-bottom: ${props => {
    if (props.size === 'small') { return '3px'; }
    if (props.size === 'large') { return '10px';}
    return '8px';
  }};
  border-bottom-color: red;
  border-bottom-width: ${props => {
    if (props.size === 'small') { return '2px'; }
    if (props.size === 'large') { return '4px';}
    return '3px';
  }};
  align-self: flex-start;
`;

const FieldLabel = props => {
  const { size, color, underline, ...other } = props;
    return (
        <FieldLabelBorder size={size}>
            <FieldLabelText underline={underline} size={size} color={color}>
                {other.children}
            </FieldLabelText>
        </FieldLabelBorder>
    )
}


FieldLabel.propTypes = {
  underline: PropTypes.bool,
  color: PropTypes.oneOf(Object.keys(colors.button)),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  style: PropTypes.array,
  z: PropTypes.oneOf(Object.keys(SHADOW).map(number => parseInt(number))),
};

FieldLabel.defaultProps = {
  underline: false,
  color: 'light',
  size: 'medium',
  z: 1,
};
export default FieldLabel;

//   color: ${props => props.theme.button[props.buttonTheme].text};
