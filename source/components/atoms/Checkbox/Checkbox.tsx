import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeContext } from 'styled-components/native';
import { getValidColorSchema } from '../../../styles/theme';
import Icon from '../Icon';

interface BoxProps {
  checked: boolean; 
  colorSchema: 'blue' | 'green' | 'red' | 'purple'; 
  size: 'small' | 'medium' | 'large'
}
const CheckboxBox = styled.TouchableHighlight<BoxProps>`
  border-style: solid;
  border-color: ${props =>
    props.checked ? 'transparent' : props.theme.colors.complementary[props.colorSchema][0]};
  background-color: ${props =>
    props.checked ? props.theme.colors.primary[props.colorSchema][3] : 'transparent'};
  width: ${props => props.theme.checkbox[size].width}px;
  height: ${props => props.theme.checkbox[size].height}px;
  padding: ${props => props.theme.checkbox[size].padding}px;
  margin: ${props => props.theme.checkbox[size].margin}px;
  border-width: ${props => props.theme.checkbox[size].borderWidth}px;
  border-radius: ${props => props.theme.checkbox[size].borderRadius}px;
`;

const CheckboxTick = styled(Icon)`
  color: ${props => props.theme.colors.neutrals[7]};
  margin-left: -2px;
  margin-top: -3px;
`;

interface Props {
  checked?: boolean;
  onChange: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  color: string;
}

const Checkbox: React.FC<Props> = ({checked, onChange, size, disabled, color}) => {
  const theme = useContext(ThemeContext);

  // some type trickery to make typescript happy
  let validColorSchema: 'blue' | 'green' | 'red' | 'purple'; 
  const vCS = getValidColorSchema(color);
  if (['blue', 'green', 'red', 'purple'].includes(vCS)) {
    validColorSchema = (vCS as 'blue' | 'green' | 'red' | 'green');
  } else { validColorSchema = 'blue'; }

  return (
    <CheckboxBox
      onPress={() => {
        if (!disabled) {
          onChange();
        }
      }}
      checked={checked}
      colorSchema={validColorSchema}
      underlayColor={theme.colors.primary[validColorSchema][2]}
      size={size || 'small'}
    >
      {checked ? <CheckboxTick size={theme.checkbox[size].icon} name="done" /> : <></>}
    </CheckboxBox>
  );
};

Checkbox.propTypes = {
  /**
   * Boolean that determines if the checkbox is checked or not. Manages the 'state' of the component.
   */
  checked: PropTypes.bool.isRequired,
  /**
   * What happens when the checkbox is clicked.
   */
  onChange: PropTypes.func,
  /**
   * sets the color theme.
   */
  color: PropTypes.string,
  /**
   * One of small, medium, large
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * Disables the checkbox if true.
   */
  disabled: PropTypes.bool,
};

Checkbox.defaultProps = {
  onChange: () => {},
  color: 'blue',
  size: 'small',
  disabled: false,
};

export default Checkbox;
