import { ThemeContext } from "styled-components";
import React, { useContext } from "react";

import RadioButton from "../../atoms/RadioButton/RadioButton";
import { getValidColorSchema } from "../../../theme/theme";
import Text from "../../atoms/Text/Text";

import {
  TouchableWrapper,
  Row,
  ButtonWrapper,
  TextWrapper,
  ErrorText,
} from "./RadioGroup.styled";

import type { Props } from "./RadiouGroup.types";

/**
 * A component for displaying a number of choices, where at most one can be selected at a time.
 */
const RadioGroup: React.FC<Props> = ({
  choices,
  value,
  onSelect,
  colorSchema,
  size,
  error,
}) => {
  const validColorSchema = getValidColorSchema(colorSchema);
  const theme = useContext(ThemeContext);
  return (
    <>
      {choices.map((choice) => (
        <TouchableWrapper
          key={choice.value}
          onPress={() => onSelect(choice.value)}
          underlayColor={theme.colors.complementary[validColorSchema][1]}
          activeOpacity={0.6}
        >
          <Row>
            <ButtonWrapper>
              <RadioButton
                onSelect={() => onSelect(choice.value)}
                selected={value === choice.value}
                colorSchema={validColorSchema}
                size={size || "small"}
              />
            </ButtonWrapper>
            <TextWrapper size={size || "small"}>
              <Text type={theme.radiobuttonGroup[size || "small"].textType}>
                {choice.displayText}
              </Text>
            </TextWrapper>
          </Row>
        </TouchableWrapper>
      ))}
      {error?.isValid === false && <ErrorText>{error.message}</ErrorText>}
    </>
  );
};

export default RadioGroup;
