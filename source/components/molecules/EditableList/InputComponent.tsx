import React from "react";
import type { TextInput } from "react-native";

import CalendarPicker from "../CalendarPicker/CalendarPickerForm";

import {
  EditableListItemInput,
  EditableListItemSelect,
} from "./EditableList.styled";

import type { Props } from "./InputComponent.types";

/** Switch between different input types */
const InputComponent = React.forwardRef<TextInput, Props>(
  (
    {
      input,
      colorSchema,
      editable,
      onChange,
      onInputBlur,
      onInputFocus,
      onClose,
      value,
      state,
    },
    ref
  ) => {
    const handleOnSelectClose = (isSelect: boolean) => {
      if (onClose) {
        onClose(isSelect);
      }
    };

    switch (input.type) {
      case "number":
        return (
          <EditableListItemInput
            colorSchema={colorSchema}
            editable={editable}
            onChangeText={(text) => onChange(input.key, text)}
            onBlur={onInputBlur}
            onFocus={onInputFocus}
            value={value && value !== "" ? value[input.key] : state[input.key]}
            keyboardType="numeric"
            transparent
            inputType={input.inputSelectValue}
            ref={ref}
          />
        );
      case "date":
        return (
          <CalendarPicker
            value={value && value !== "" ? value[input.key] : state[input.key]}
            onSelect={(date) => onChange(input.key, date)}
            onBlur={onInputBlur}
            onFocus={onInputFocus}
            editable={editable}
            transparent
          />
        );
      case "select":
        return (
          <EditableListItemSelect
            onBlur={onInputBlur}
            onOpen={onInputFocus}
            onClose={handleOnSelectClose}
            onValueChange={(value) => onChange(input.key, value)}
            value={value && value !== "" ? value[input.key] : state[input.key]}
            editable={editable}
            items={input?.items || []}
            ref={ref}
          />
        );
      default:
        return (
          <EditableListItemInput
            colorSchema={colorSchema}
            editable={editable}
            onChangeText={(text) => onChange(input.key, text)}
            onBlur={onInputBlur}
            onFocus={onInputFocus}
            value={value && value !== "" ? value[input.key] : state[input.key]}
            transparent
            inputType={input.inputSelectValue}
            ref={ref}
          />
        );
    }
  }
);
InputComponent.displayName = "InputComponent";

export default InputComponent;
