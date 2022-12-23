import React from "react";
import type { TextInput } from "react-native";

import CalendarPicker from "../CalendarPicker/CalendarPickerForm";

import {
  EditableListItemInput,
  EditableListItemSelect,
} from "./EditableList.styled";

import type { Props } from "./InputComponent.types";

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
    const handleOnSelectClose = (event: unknown, isSelect: boolean) => {
      if (onClose) {
        onClose(event, isSelect);
      }
    };

    const inputValue =
      value && value !== "" ? value[input.key] : state[input.key];

    switch (input.type) {
      case "number":
        return (
          <EditableListItemInput
            colorSchema={colorSchema}
            editable={editable}
            onChangeText={(text) => onChange(input.key, text)}
            onBlur={onInputBlur}
            onFocus={(event) => onInputFocus(event, false)}
            value={inputValue as string}
            keyboardType="numeric"
            transparent
            inputType={input.type}
            ref={ref}
          />
        );
      case "date":
        return (
          <CalendarPicker
            value={inputValue as number}
            onSelect={(date) => onChange(input.key, date)}
            editable={editable}
            transparent
            colorSchema={colorSchema}
          />
        );
      case "select": {
        return (
          <EditableListItemSelect
            onBlur={onInputBlur}
            onOpen={onInputFocus}
            onClose={handleOnSelectClose}
            onValueChange={(newValue) =>
              newValue !== null && onChange(input.key, newValue)
            }
            value={inputValue as string}
            editable={editable}
            items={input?.items || []}
            ref={ref}
          />
        );
      }
      default:
        return (
          <EditableListItemInput
            colorSchema={colorSchema}
            editable={editable}
            onChangeText={(text) => onChange(input.key, text)}
            onBlur={onInputBlur}
            onFocus={(event) => onInputFocus(event, false)}
            value={inputValue as string}
            transparent
            inputType={input.type}
            ref={ref}
          />
        );
    }
  }
);
InputComponent.displayName = "InputComponent";

export default InputComponent;
