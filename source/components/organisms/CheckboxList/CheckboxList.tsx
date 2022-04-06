import React, { useState, useEffect } from "react";
import styled from "styled-components/native";

import { Checkbox, Text } from "app/components/atoms";
import { ComplementaryColor } from "../../../styles/themeHelpers";

interface CheckboxListProps {
  choices: { displayText: string; tags?: string[]; id: string }[];
  onChange?: (values: Record<string, boolean>) => void;
  onBlur?: (values: Record<string, boolean>) => void;
  value?: Record<string, boolean>;
  colorSchema?: ComplementaryColor;
}

const BoxTextWrapper = styled.View`
  flex: auto;
  flex-direction: row;
  align-items: flex-start;
`;

const sizes = {
  small: {
    padding: 0.25,
    margin: 4,
    marginTop: 0,
    fontSize: 12,
  },
  medium: {
    padding: 0.5,
    margin: 4,
    fontSize: 15,
  },
  large: {
    padding: 1,
    margin: 5,
    fontSize: 18,
  },
};

const CheckboxFieldText = styled(Text)<{ size: "small" | "medium" | "large" }>`
  margin-left: ${(props) => props.theme.sizes[1]}px;
  margin-right: ${(props) => props.theme.sizes[1]}px;
  font-size: ${(props) => sizes[props.size].fontSize}px;
`;

const CheckboxList = (props: CheckboxListProps): JSX.Element => {
  const {
    choices = [],
    onChange,
    onBlur,
    value: answerValues,
    colorSchema = "red",
  } = props;

  const [values, setValues] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initialValues: Record<string, boolean> = choices.reduce(
      (acc, current) => {
        acc[current.id] = answerValues?.[current.id] ?? false;
        return acc;
      },
      {} as Record<string, boolean>
    );

    setValues(initialValues);
  }, []);

  const update = (id: string) => {
    const newValue = !values[id];

    setValues({ ...values, [id]: newValue });

    values[id] = newValue;

    if (onChange) onChange(values);
    if (onBlur) onBlur(values);
  };

  return (
    <>
      {choices.map((choice) => (
        <BoxTextWrapper key={choice.id}>
          <Checkbox
            colorSchema={colorSchema}
            size="small"
            onChange={() => update(choice.id)}
            checked={values[choice.id]}
            // {...other}
          />
          <CheckboxFieldText color={colorSchema} size="small">
            {choice.displayText}
          </CheckboxFieldText>
        </BoxTextWrapper>
      ))}
    </>
  );
};

export default CheckboxList;
