import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeContext } from 'styled-components/native';
import { getValidColorSchema, PrimaryColor } from '../../../styles/themeHelpers';
import Icon from '../Icon';

interface BoxProps {
  checked: boolean;
  colorSchema: PrimaryColor;
  backgroundColor: string;
  size: 'small' | 'medium' | 'large';
}
const CheckboxBox = styled.TouchableHighlight<BoxProps>`
  border-style: solid;
  border-color: ${(props) =>
    props.checked ? 'transparent' : props.theme.colors.complementary[props.colorSchema][0]};
  background-color: ${({ checked, backgroundColor }) =>
    checked ? backgroundColor : 'transparent'};
  width: ${(props) => props.theme.checkbox[props.size].width}px;
  height: ${(props) => props.theme.checkbox[props.size].height}px;
  padding: ${(props) => props.theme.checkbox[props.size].padding}px;
  margin: ${(props) => props.theme.checkbox[props.size].margin}px;
  border-width: ${(props) => props.theme.checkbox[props.size].borderWidth}px;
  border-radius: ${(props) => props.theme.checkbox[props.size].borderRadius}px;
`;

type CheckboxTickType = {
  color: string;
};
const CheckboxTick = styled(Icon)<CheckboxTickType>`
  color: ${({ color }) => color};
  margin-left: -2px;
  margin-top: -3px;
`;

interface Props {
  checked?: boolean;
  onChange: () => void;
  disabled?: boolean;
  invertColors?: boolean;
  size?: 'small' | 'medium' | 'large';
  colorSchema: PrimaryColor;
}

const Checkbox: React.FC<Props> = ({
  checked,
  onChange,
  size,
  disabled,
  colorSchema,
  invertColors = false,
}) => {
  const { colors, checkbox } = useContext(ThemeContext);
  const validColorSchema = getValidColorSchema(colorSchema);

  const canInvertColors = checked && invertColors;

  const tickColor = canInvertColors ? colors.primary[colorSchema][3] : colors.neutrals[7];
  const checkboxColor = canInvertColors ? 'transparent' : colors.primary[colorSchema][3];
  const underlayColor = canInvertColors ? 'transparent' : colors.primary[validColorSchema][2];

  return (
    <CheckboxBox
      disabled={disabled}
      onPress={() => {
        if (!disabled) {
          onChange();
        }
      }}
      checked={checked}
      colorSchema={validColorSchema}
      underlayColor={underlayColor}
      size={size || 'small'}
      backgroundColor={checkboxColor}
    >
      {checked ? <CheckboxTick color={tickColor} size={checkbox[size].icon} name="done" /> : <></>}
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
  colorSchema: PropTypes.oneOf(['red', 'blue', 'green', 'purple', 'neutral']),
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
  colorSchema: 'blue',
  size: 'small',
  disabled: false,
};

export default Checkbox;
