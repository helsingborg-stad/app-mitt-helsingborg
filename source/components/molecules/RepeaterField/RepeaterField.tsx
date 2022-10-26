import React, { useState } from "react";
import { LayoutAnimation } from "react-native";

import { RepeaterFieldListItem } from "..";

import { Icon, Text, Fieldset } from "../../atoms";

import { getValidColorSchema } from "../../../theme/themeHelpers";

import AddButton from "./RepeaterField.styled";

import type { Props, InputRow, Answer } from "./RepeaterField.types";

const emptyInput: Record<string, string | number>[] = [];

function isRecordArray(value: string | Answer[]): value is Answer[] {
  return typeof value !== "string" && Array.isArray(value);
}
/**
 * Repeater field component, for adding multiple copies of a particular kind of input.
 * The input-prop specifies the form of each input-group.
 */
const RepeaterField: React.FC<Props> = ({
  heading,
  addButtonText,
  inputs = [],
  colorSchema,
  value,
  error,
  maxRows,
  onChange = () => undefined,
  onBlur,
  onAddAnswer,
  onFocus,
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
    const newAnswers: Answer = {};
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
        key={answer.id}
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

export default RepeaterField;
