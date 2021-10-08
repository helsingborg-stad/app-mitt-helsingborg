import React, { useContext } from "react";
import { ThemeContext } from "styled-components/native";

import MIcon from "../../atoms/Icon";

import { ButtonContainer, ButtonText } from "./styled";

interface FloatingButtonProps {
  type: "icon" | "text";
  onPress: () => void;
  colorSchema?: "red" | "neutral";
  text?: string;
  iconName?: string;
  position?: "left" | "center" | "right";
}

const FloatingButton = ({
  type,
  onPress,
  colorSchema = "red",
  text,
  iconName,
  position = "center",
}: FloatingButtonProps): JSX.Element => {
  const theme = useContext(ThemeContext);

  return (
    <ButtonContainer
      testID="floatingButton"
      onPress={onPress}
      underlayColor={theme.colors.neutrals[4]}
      colorSchema={colorSchema}
      position={position}
      type={type}
    >
      {type === "icon" && iconName ? (
        <MIcon
          testID="floatingButton_icon"
          name={iconName}
          color={theme.colors.neutrals[7]}
          size={32}
        />
      ) : (
        <ButtonText colorSchema={colorSchema}>{text}</ButtonText>
      )}
    </ButtonContainer>
  );
};

export default FloatingButton;
