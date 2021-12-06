import React from "react";
import { View } from "react-native";

import { Icon, Text } from "../../atoms";

import { ButtonListContainer, StyledButton, Underline } from "./styled";

type ButtonListItem = {
  buttonText: string;
  icon: string;
  onClick: () => void;
  colorSchema?: string;
  variant?: string;
  underline?: boolean;
};

interface ButtonListProps {
  defaultColorSchema: string;
  defaultVariant?: string;
  buttonList: ButtonListItem[];
}

const ButtonList = (props: ButtonListProps): JSX.Element => {
  const { defaultColorSchema, buttonList, defaultVariant } = props;

  return (
    <ButtonListContainer>
      {buttonList.map(
        ({
          buttonText,
          onClick,
          icon,
          colorSchema = undefined,
          variant = undefined,
          underline = false,
        }) => {
          const schema = colorSchema || defaultColorSchema;
          const buttonVariant = variant || defaultVariant;
          return (
            <View key={buttonText}>
              <StyledButton
                colorSchema={schema}
                fullWidth
                variant={buttonVariant}
                onClick={onClick}
              >
                <Icon name={icon} />
                <Text>{buttonText}</Text>
              </StyledButton>
              {underline && <Underline />}
            </View>
          );
        }
      )}
    </ButtonListContainer>
  );
};

export default ButtonList;
