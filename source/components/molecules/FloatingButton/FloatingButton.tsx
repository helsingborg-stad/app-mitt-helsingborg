import React, { useContext } from "react";
import { ThemeContext } from "styled-components/native";

import MIcon from "../../atoms/Icon";

import { ButtonContainer, ButtonText } from "./styled";

import type { FloatingButtonProps } from "./types";

const FloatingButton = ({
  onPress,
  text,
  iconName,
  colorSchema = "red",
  buttonWidth = "54px",
  borderRadius = 16,
  position = "right",
  iconSize = 24,
  justifyContent = "flex-start",
}: FloatingButtonProps): JSX.Element => {
  const theme = useContext(ThemeContext);

  const iconPadding = iconName && text ? 4 : 0;

  return (
    <ButtonContainer
      testID="floatingButton"
      onPress={onPress}
      underlayColor={theme.colors.neutrals[4]}
      colorSchema={colorSchema}
      position={position}
      borderRadius={borderRadius}
      buttonWidth={buttonWidth}
      justifyContent={justifyContent}
    >
      <>
        {iconName && (
          <MIcon
            testID="floatingButton_icon"
            name={iconName}
            color={theme.colors.neutrals[7]}
            size={iconSize}
            style={{ marginRight: iconPadding }}
          />
        )}

        {text && <ButtonText colorSchema={colorSchema}>{text}</ButtonText>}
      </>
    </ButtonContainer>
  );
};

export default FloatingButton;
