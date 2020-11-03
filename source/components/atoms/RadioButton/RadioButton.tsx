import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { TouchableHighlight, LayoutAnimation } from 'react-native';
import styled, { ThemeContext } from 'styled-components';
import SHADOW from '../../../styles/shadow';

const TouchableSizes = {
  small: {
    height: 22,
    width: 22,
    borderRadius: 11,
  },
  medium: {
    height: 36,
    width: 36,
    borderRadius: 18,
  },
  large: {
    height: 48,
    width: 48,
    borderRadius: 24,
  },
};

const BorderSizes = {
  small: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    padding: 0,
    margin: 0,
  },
  medium: {
    height: 36,
    width: 36,
    borderRadius: 18,
    borderWidth: 3,
    padding: 0,
    margin: 0,
  },
  large: {
    height: 48,
    width: 48,
    borderRadius: 24,
    borderWidth: 4,
    padding: 0,
    margin: 0,
  },
};

const FillSizes = {
  small: {
    height: 16,
    width: 16,
    borderRadius: 10,
    margin: 2,
  },
  medium: {
    height: 25,
    width: 25,
    borderRadius: 12.5,
    margin: 4,
  },
  large: {
    height: 35,
    width: 35,
    borderRadius: 17.5,
    margin: 6,
  },
};

const RadioButtonBorder = styled.View<{ colorSchema: string; z: 0 | 1 | 2 | 3 | 4  }>`
  align-items: center;
  justify-content: center;
  border-color: ${props => props.theme.colors.primary[props.colorSchema][0]};
  shadow-color: ${props => props.theme.button[props.colorSchema].shadow};
  ${props => SHADOW[props.z]}
`;
  
const RadioButtonFill = styled.View<{ colorSchema: string }>`
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.primary[props.colorSchema][1]};
`;

interface Props {
  selected?: boolean;
  colorSchema?: string;
  size?: 'small' | 'medium' | 'large';
  onSelect: () => void;
}
const RadioButton: React.FC<Props> = ({ selected, onSelect, colorSchema, size }) => {
  const theme = useContext(ThemeContext);
  const onPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onSelect();
  };

  const validColorSchema = Object.keys(theme.colors.primary).includes(colorSchema)
    ? colorSchema
    : 'blue';

  return (
    <TouchableHighlight
      onPress={onPress}
      activeOpacity={0.6}
      underlayColor={theme.colors.complementary[validColorSchema][0]}
      style={TouchableSizes[size]}
    >
      <RadioButtonBorder style={BorderSizes[size]} colorSchema={validColorSchema} z={1}>
        {selected && <RadioButtonFill style={FillSizes[size]} colorSchema={validColorSchema} />}
      </RadioButtonBorder>
    </TouchableHighlight>
  );
};

RadioButton.propTypes = {
  /** Whether the radio button is selected (filled) or not */
  selected: PropTypes.bool.isRequired,
  /** Callback function, what happens when the button is pressed. */
  onSelect: PropTypes.func.isRequired,
  /** The color scheme of the button */
  colorSchema: PropTypes.string,
  /** The size of the button. Default is small. */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

RadioButton.defaultProps = {
  colorSchema: 'blue',
  size: 'small',
};

export default RadioButton;
