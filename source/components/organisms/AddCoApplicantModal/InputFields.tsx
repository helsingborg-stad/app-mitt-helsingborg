import React from "react";
import { KeyboardTypeOptions } from "react-native";

import { Input } from "../../atoms";

import InputLabel from "./InputFields.styled";

interface InputField {
  testId: string;
  label: string;
  placeholder?: string;
  keyboardType?: string;
  value: string;
  maxLength?: number;
  onChange: (value: string) => void;
}

interface InputFieldsProps {
  fields: InputField[];
}
export default function InputFields({ fields }: InputFieldsProps): JSX.Element {
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
