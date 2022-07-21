import React from "react";
import type { KeyboardTypeOptions } from "react-native";

import { Input } from "../../atoms";

import InputLabel from "./InputFields.styled";

import type { Props } from "./InputFields.types";

export default function InputFields({ fields }: Props): JSX.Element {
  return (
    <>
      {fields.map((field) => (
        <React.Fragment key={field.testId}>
          <InputLabel strong>{field.label}</InputLabel>
          <Input
            testID={field.testId}
            onChangeText={field.onChange}
            onBlur={() => undefined}
            onMount={() => undefined}
            placeholder={field.placeholder}
            value={field.value}
            maxLength={field.maxLength}
            keyboardType={field.keyboardType as KeyboardTypeOptions}
          />
        </React.Fragment>
      ))}
    </>
  );
}
