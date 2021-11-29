import React from "react";
import styled from "styled-components/native";

import { Icon, Text } from "../../atoms";

import { ButtonListContainer, StyledButton } from "./styled";

const Underline = styled.View`
  margin-bottom: 15px;
  margin-top: 3px;
  margin-left: 5px;
  margin-right: 5px;
  height: 2px;
  background-color: ${(props) => props.theme.colors.neutrals[5]};
`;

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
          underline = false,
        }) => {
          const schema = colorSchema || defaultColorSchema;
          const buttonVariant = variant || defaultVariant;
          return (
            <>
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
              {underline && <Underline />}
            </>
          );
        }
      )}
    </ButtonListContainer>
  );
};

export default ButtonList;
