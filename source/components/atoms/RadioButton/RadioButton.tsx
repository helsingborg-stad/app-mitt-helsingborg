import React, { useContext } from "react";
import { LayoutAnimation } from "react-native";
import { ThemeContext } from "styled-components/native";

import { getValidColorSchema } from "../../../theme/themeHelpers";

import {
  TouchableArea,
  RadioButtonBorder,
  RadioButtonFill,
} from "./RadioButton.styled";

import type { Props } from "./RadioButton.types";

const configureAnimation = () =>
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

const RadioButton: React.FC<Props> = ({
  selected,
  onSelect,
  colorSchema = "blue",
  size = "small",
}) => {
  const theme = useContext(ThemeContext);
  const onPress = () => {
    configureAnimation();
    onSelect();
  };
  const validColorSchema = getValidColorSchema(colorSchema);

  return (
    <TouchableArea
      onPress={onPress}
      activeOpacity={0.6}
      underlayColor={theme.colors.complementary[validColorSchema][0]}
      size={size}
    >
      <RadioButtonBorder size={size} colorSchema={validColorSchema} z={1}>
        {selected && (
          <RadioButtonFill size={size} colorSchema={validColorSchema} />
        )}
      </RadioButtonBorder>
    </TouchableArea>
  );
};

export default RadioButton;
