import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { LayoutAnimation } from "react-native";
import { Button, Icon, Text } from "../../atoms";
import RepeaterFieldListItem from "./RepeaterFieldListItem";
import Fieldset from "../../atoms/Fieldset/Fieldset";
import type {
  PrimaryColor} from "../../../styles/themeHelpers";
import {
  getValidColorSchema
} from "../../../styles/themeHelpers";
import type { InputFieldType } from "../../../types/FormTypes";

const AddButton = styled(Button)`
  margin-top: 30px;
  background: ${(props) => props.theme.colors.neutrals[7]};
  border: 0;
`;
export interface InputRow {
  id: string;
  title: string;
  type: "text" | "date" | "number" | "hidden" | "select";
  inputSelectValue: InputFieldType;
  value?: string;
}

type Answers = Record<string, any> | string | number;

interface Props {
  heading: string;
  addButtonText?: string;
  inputs: InputRow[];
  value: string | Record<string, string | number>[];
  onChange: (answers: Answers, fieldId?: string) => void;
  onBlur?: (answers: Answers, fieldId?: string) => void;
  onAddAnswer?: (answers: Answers, fieldId?: string) => void;
  onFocus?: (event: FocusEvent) => void;
  colorSchema: PrimaryColor;
  error?: Record<string, { isValid: boolean; validationMessage: string }>[];
  maxRows?: number;
}
const emptyInput: Record<string, string | number>[] = [];

function isRecordArray(
  value: string | Record<string, string | number>[]
): value is Record<string, string | number>[] {
  return typeof value !== "string";
}
/**
 * Repeater field component, for adding multiple copies of a particular kind of input.
 * The input-prop specifies the form of each input-group.
 */
const RepeaterField: React.FC<Props> = ({
  heading,
  addButtonText,
  inputs,
  onChange,
  onBlur,
  onAddAnswer,
  onFocus,
  colorSchema,
  value,
  error,
  maxRows,
}) => {
  const [localAnswers, setLocalAnswers] = useState(
    isRecordArray(value) ? value : emptyInput
  );

  const changeFromInput =
    (index: number) => (input: InputRow) => (text: string) => {
      localAnswers[index][input.id] = text;
      onChange(localAnswers);
      setLocalAnswers([...localAnswers]);
    };

  const onInputBlur = () => {
    if (onBlur) onBlur(localAnswers);
  };

  const onInputFocus = (event: FocusEvent) => {
    if (onFocus) onFocus(event);
  };

  const removeAnswer = (index: number) => () => {
    setLocalAnswers((prev) => {
      prev.splice(index, 1);
      onChange(prev);
      if (onBlur) onBlur(prev);
      return [...prev];
    });
  };

  const addAnswer = () => {
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
    // construct a new answer object from the inputs, where each answer is either the input value or an empty string to start
    const newAnswers = {};
    inputs.forEach((input) => {
      newAnswers[input.id] = input.value || "";
    });
    const updatedAnswers = [...localAnswers, newAnswers];
    onChange(updatedAnswers);
    setLocalAnswers(updatedAnswers);
    if (onAddAnswer) {
      onAddAnswer(updatedAnswers);
    }
  };

  const validColorSchema = getValidColorSchema(colorSchema);

  const listItems: JSX.Element[] = [];
  localAnswers.forEach((answer, index) => {
    listItems.push(
      <RepeaterFieldListItem
        key={`${index}`}
        heading={`${heading} ${index + 1}`}
        inputs={inputs}
        value={answer}
        changeFromInput={changeFromInput(index)}
        onBlur={onInputBlur}
        color={validColorSchema}
        removeItem={removeAnswer(index)}
        error={error && error[index] ? error[index] : undefined}
        onFocus={onInputFocus}
      />
    );
  });

  return (
    <Fieldset
      legend={heading}
      colorSchema={validColorSchema}
      empty={listItems.length === 0}
    >
      {listItems}
      <AddButton
        onClick={addAnswer}
        colorSchema="green"
        block
        variant="outlined"
        disabled={maxRows && listItems.length >= maxRows}
      >
        <Icon name="add" color="green" />
        <Text>{addButtonText || "Lägg till"}</Text>
      </AddButton>
    </Fieldset>
  );
};

RepeaterField.propTypes = {
  /**
   * The header text of the list.
   */
  heading: PropTypes.string,
  /**
   * List of inputs for a single element.
   */
  inputs: PropTypes.array,
  /**
   * What should happen when we update the values
   */
  onChange: PropTypes.func,
  /**
   * Sets the color scheme of the list. default is red.
   */
  color: PropTypes.string,
  /**
   * The value of the field.
   */
  value: PropTypes.any,
};

RepeaterField.defaultProps = {
  inputs: [],
  color: "red",
  onChange: () => {},
};
export default RepeaterField;
