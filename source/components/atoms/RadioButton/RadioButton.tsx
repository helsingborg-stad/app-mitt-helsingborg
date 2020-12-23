import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { TouchableHighlight, LayoutAnimation, View } from 'react-native';
import styled, { ThemeContext } from 'styled-components';
import {getValidColorSchema} from '../../../styles/theme';
import SHADOW from '../../../styles/shadow';

const TouchableArea = styled(TouchableHighlight)<{size: 'small' | 'medium' | 'large'}>`
  height: ${({theme, size}) => theme.radiobutton[size].touchable.height}px;
  width: ${({theme, size})  => theme.radiobutton[size].touchable.width}px;
  border-radius: ${({theme, size})  => theme.radiobutton[size].touchable.borderRadius}px;
`

const RadioButtonBorder = styled(View)<{ colorSchema: string; z: 0 | 1 | 2 | 3 | 4; size: 'small'|'medium' | 'large' }>`
  align-items: center;
  justify-content: center;
  border-color: ${props => props.theme.colors.primary[props.colorSchema][0]};
  shadow-color: ${props => props.theme.button[props.colorSchema].shadow};
  height: ${({theme, size}) => theme.radiobutton[size].border.height}px;
  width: ${({theme, size})  => theme.radiobutton[size].border.width}px;
  border-radius: ${({theme, size}) => theme.radiobutton[size].border.borderRadius}px;
  border-width: ${({theme, size}) => theme.radiobutton[size].border.borderWidth}px;
  margin: 0;
  padding: 0;
  ${props => SHADOW[props.z]}
`;
  
const RadioButtonFill = styled(View)<{ colorSchema: string; size: 'small' | 'medium' | 'large' }>`
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.primary[props.colorSchema][1]};
  height: ${({theme, size}) => theme.radiobutton[size].fill.height}px;
  width: ${({theme, size})  => theme.radiobutton[size].fill.width}px;
  border-radius: ${({theme, size}) => theme.radiobutton[size].fill.borderRadius}px;
  margin: ${({theme, size}) => theme.radiobutton[size].fill.margin}px;
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
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });
    onSelect();
  };
  const validColorSchema = getValidColorSchema(colorSchema);

  return (
    <TouchableArea
      onPress={onPress}
      activeOpacity={0.6}
      underlayColor={theme.colors.complementary[validColorSchema][0]}
      size={size || 'small'}
    >
      <RadioButtonBorder size={size || 'small'} colorSchema={validColorSchema} z={1}>
        {selected && <RadioButtonFill size={size || 'small'} colorSchema={validColorSchema} />}
      </RadioButtonBorder>
    </TouchableArea>
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
