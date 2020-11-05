import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeContext } from 'styled-components/native';
import { getValidColorSchema } from '../../../styles/theme';

import Icon from '../Icon';

const CheckboxBox = styled.TouchableHighlight`
  border-style: solid;
  border-color: ${props => (props.checked ? 'transparent' : props.theme.colors.neutrals[4])};
  background-color: ${props =>
    props.checked ? props.theme.colors.primary[props.colorSchema][3] : 'transparent'};
`;

const CheckboxTick = styled(Icon)`
  color: ${props => props.theme.colors.neutrals[7]};
  margin-left: -2px;
  margin-top: -3px;
`;

// TODO: THEME/STYLING MOVE sizes to theme declaration in theme.js
const sizes = {
  small: {
    width: 18,
    height: 18,
    padding: 0.5,
    margin: 4,
    borderWidth: 2,
    borderRadius: 3,
  },
  medium: {
    width: 35,
    height: 35,
    padding: 0.5,
    margin: 4,
    borderWidth: 2,
    borderRadius: 7,
  },
  large: {
    width: 52,
    height: 52,
    padding: 0,
    margin: 4,
    borderWidth: 3.2,
    borderRadius: 10,
  },
};

const iconSizes = {
  small: 18,
  medium: 36,
  large: 50,
};

const Checkbox = props => {
  const { checked, onChange, size, disabled, color } = props;
  const theme = useContext(ThemeContext);
  const style = {
    ...sizes[size],
  };
  const validColorSchema = getValidColorSchema(color);
  console.log('validColorSchema', validColorSchema);
  const tickIcon = <CheckboxTick size={iconSizes[size]} name="done" />;
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
      style={style}
    >
      {checked ? tickIcon : <></>}
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
  size: PropTypes.oneOf(Object.keys(sizes)),
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
