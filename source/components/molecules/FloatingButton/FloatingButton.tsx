import React, { useContext } from "react";
import { View } from "react-native";
import { ThemeContext } from "styled-components/native";

import MIcon from "../../atoms/Icon";

import { ButtonContainer, ButtonText } from "./styled";

interface FloatingButtonProps {
  type: "icon" | "text" | "text-icon";
  onPress: () => void;
  colorSchema?: "red" | "neutral";
  text?: string;
  iconName?: string;
  position?: "left" | "right";
}

const FloatingButton = ({
  type,
  onPress,
  colorSchema = "red",
  text,
  iconName,
  position = "right",
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
      <>
        {type === "icon" && iconName && (
          <MIcon
            testID="floatingButton_icon"
            name={iconName}
            color={theme.colors.neutrals[7]}
            size={32}
          />
        )}

        {type === "text" && (
          <ButtonText colorSchema={colorSchema}>{text}</ButtonText>
        )}

        {type === "text-icon" && iconName && (
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MIcon
              testID="floatingButton_icon"
              name={iconName}
              color={theme.colors.neutrals[7]}
              size={24}
              style={{ marginRight: 4 }}
            />
            <ButtonText colorSchema={colorSchema}>{text}</ButtonText>
          </View>
        )}
      </>
    </ButtonContainer>
  );
};

export default FloatingButton;
