import React, { useContext } from "react";
import { ThemeContext } from "styled-components/native";

import { getValidColorSchema } from "../../../theme/themeHelpers";

import { CheckboxBox, CheckboxTick } from "./Checkbox.styled";

import type { Props } from "./Checkbox.types";

const Checkbox: React.FC<Props> = ({
  checked,
  onChange,
  size = "small",
  disabled = false,
  colorSchema = "blue",
  invertColors = false,
}) => {
  const { colors, checkbox } = useContext(ThemeContext);
  const validColorSchema = getValidColorSchema(colorSchema);

  const canInvertColors = checked && invertColors;

  const tickColor = canInvertColors
    ? colors.primary[colorSchema][3]
    : colors.neutrals[7];
  const checkboxColor = canInvertColors
    ? "transparent"
    : colors.primary[colorSchema][3];
  const underlayColor = canInvertColors
    ? "transparent"
    : colors.primary[validColorSchema][2];

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
      size={size}
      backgroundColor={checkboxColor}
    >
      {checked ? (
        <CheckboxTick
          color={tickColor}
          size={checkbox[size].icon}
          name="done"
        />
      ) : (
        <></>
      )}
    </CheckboxBox>
  );
};

export default Checkbox;
