import React from "react";

import { Icon, Text } from "../../atoms";

import { ButtonListContainer, StyledButton } from "./styled";

type ButtonListItem = {
  buttonText: string;
  icon: string;
  onClick: () => void;
  colorSchema?: string;
  variant?: string;
};

interface ButtonListProps {
  defaultColorSchema: string;
  defaultVariant: string;
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
        }) => {
          const schema = colorSchema || defaultColorSchema;
          const buttonVariant = variant || defaultVariant;
          return (
            <StyledButton
              key={buttonText}
              colorSchema={schema}
              fullWidth
              variant={buttonVariant}
              onClick={onClick}
            >
              <Icon name={icon} />
              <Text>{buttonText}</Text>
            </StyledButton>
          );
        }
      )}
    </ButtonListContainer>
  );
};

export default ButtonList;
