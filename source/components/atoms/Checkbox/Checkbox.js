import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Icon from '../Icon';
import colors from '../../../styles/colors';

const CheckboxBox = styled.TouchableHighlight`
  border-style: solid;
`;

const sizes = {
  small: {
    width: 20,
    height: 20,
    padding: 0.5,
    margin: 4,
    borderWidth: 1.2,
    borderRadius: 3,
  },
  medium: {
    width: 35,
    height: 35,
    padding: 0.5,
    margin: 4,
    borderWidth: 1,
    borderRadius: 7,
  },
  large: {
    width: 52,
    height: 52,
    padding: 0,
    margin: 4,
    borderWidth: 3.2,
    borderRadius: 10,
  }
};

const iconSizes = {
  small: 16,
  medium: 32,
  large: 48,
};

const Checkbox = props => {
  const { checked, onChange, size, disabled, color, ...other } = props;
  const iconStyle = { color: colors.checkbox[color].icon };

  const style = {
    backgroundColor: disabled ? colors.checkbox[color].disabled : colors.checkbox[color].background,
    borderColor: colors.checkbox[color].border,
    ...sizes[size],
  };
  const tickIcon = <Icon style={iconStyle} size={iconSizes[size]} name="done"></Icon>;
  return (
    <CheckboxBox
      onPress={() => {
        if (!disabled) {
          onChange();
        }
      }}
      underlayColor={colors.checkbox[color].touch}
      style={style}
    >
      {checked ? tickIcon : <></>}
    </CheckboxBox>
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  color: PropTypes.oneOf(Object.keys(colors.checkbox)),
  size: PropTypes.oneOf(Object.keys(sizes)),
  disabled: PropTypes.bool,
};

Checkbox.defaultProps = {
  onChange: () => {},
  color: 'light',
  size: 'small',
  disabled: false,
};

export default Checkbox;
