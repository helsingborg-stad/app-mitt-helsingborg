import React, { useContext } from "react";
import PropTypes from "prop-types";
import styled, { ThemeContext } from "styled-components";
import { View, TouchableHighlight } from "react-native";
import RadioButton from "../../atoms/RadioButton/RadioButton";
import Text from "../../atoms/Text/Text";
import { getValidColorSchema } from "../../../styles/theme";

const TouchableWrapper = styled(TouchableHighlight)`
  border-radius: 4px;
  padding: 2px;
`;
const Row = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: 3px;
  margin-top: 3px;
`;
const ButtonWrapper = styled(View)`
  flex: 1;
`;
const TextWrapper = styled(View)<{ size: "small" | "medium" | "large" }>`
  flex: 10;
  margin-left: ${(props) =>
    props.theme.radiobuttonGroup[props.size].textMargin}px;
`;

interface Props {
  choices: { displayText: string; value: string }[];
  value?: string;
  onSelect: (value: string) => void;
  colorSchema?: string;
  size?: "small" | "medium" | "large";
}

/**
 * A component for displaying a number of choices, where at most one can be selected at a time.
 */
const RadioGroup: React.FC<Props> = ({
  choices,
  value,
  onSelect,
  colorSchema,
  size,
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
    </>
  );
};
RadioGroup.propTypes = {
  /** The array of choices, each entry corresponding to one row */
  choices: PropTypes.arrayOf(
    PropTypes.shape({
      /** The text next to the button */
      displayText: PropTypes.string,
      /** The value to store in the context/backend */
      value: PropTypes.string,
    })
  ).isRequired,
  /** The value selecting which button to mark. If blank, no button is selected */
  value: PropTypes.string,
  /** Callback for when a button is clicked */
  onSelect: PropTypes.func,
  /** Color theme for the component, referencing the theme */
  colorSchema: PropTypes.string,
  /** Size of buttons and text, one of small, medium, large */
  size: PropTypes.oneOf(["small", "medium", "large"]),
};

export default RadioGroup;
