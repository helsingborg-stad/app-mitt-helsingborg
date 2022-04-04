import React, { useState, useEffect } from "react";

import { Checkbox } from "../../atoms";
import { ComplementaryColor } from "../../../styles/themeHelpers";
import { BoxTextWrapper, CheckboxFieldText } from "./CheckboxList.styled";

interface CheckboxListProps {
  choices: { displayText: string; tags?: string[]; id: string }[];
  onChange?: (values: Record<string, boolean>) => void;
  onBlur?: (values: Record<string, boolean>) => void;
  value?: Record<string, boolean>;
  colorSchema?: ComplementaryColor;
  size?: "small" | "medium" | "large";
}

const CheckboxList = (props: CheckboxListProps): JSX.Element => {
  const {
    choices = [],
    onChange,
    onBlur,
    value: answerValues,
    colorSchema = "red",
    size = "small",
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
            size={size}
            onChange={() => update(choice.id)}
            checked={values[choice.id] ?? false}
            // {...other}
          />
          <CheckboxFieldText size={size}>
            {choice.displayText}
          </CheckboxFieldText>
        </BoxTextWrapper>
      ))}
    </>
  );
};

export default CheckboxList;
