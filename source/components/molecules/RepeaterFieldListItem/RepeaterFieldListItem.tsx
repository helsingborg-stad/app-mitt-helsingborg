import React, { useRef } from "react";

import CalendarPicker from "../CalendarPicker/CalendarPickerForm";
import { getValidColorSchema } from "../../../theme/themeHelpers";

import {
  Base,
  TopContainer,
  RepeaterItem,
  ItemLabel,
  InputLabelWrapper,
  InputLabel,
  InputWrapper,
  ItemInput,
  SelectInput,
  DeleteButtonText,
  DeleteButton,
} from "./RepeaterFieldListItem.styled";

import type { Props, InputComponentProps } from "./RepeaterFieldListItem.types";

// eslint-disable-next-line react/display-name
const InputComponent = React.forwardRef(
  (
    {
      input,
      colorSchema,
      value,
      onChange,
      onBlur,
      onFocus,
      error = undefined,
      showErrorMessage = false,
    }: InputComponentProps,
    ref
  ) => {
    switch (input.type) {
      default:
      case "hidden":
      case "number":
      case "text": {
        const isHidden = input.type === "hidden";
        const keyboardType = input.type === "number" ? "numeric" : "default";
        const inputValue =
          input.type === "hidden" ? input?.value?.toString() : value.toString();
        return (
          <ItemInput
            textAlign="right"
            colorSchema={colorSchema}
            value={inputValue}
            onChangeText={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            transparent
            inputType={input.inputSelectValue}
            error={error}
            showErrorMessage={showErrorMessage}
            ref={ref}
            hidden={isHidden}
            keyboardType={keyboardType}
          />
        );
      }
      case "date":
        return (
          <CalendarPicker
            colorSchema={colorSchema}
            value={value as number}
            onSelect={onChange}
            editable
            transparent
          />
        );
      case "select":
        return (
          <SelectInput
            items={input.items}
            colorSchema={colorSchema}
            value={value.toString()}
            onValueChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            transparent
            error={error}
            showErrorMessage={showErrorMessage}
            ref={ref}
          />
        );
    }
  }
);

const RepeaterFieldListItem: React.FC<Props> = ({
  heading,
  inputs,
  value,
  error,
  color = "blue",
  changeFromInput,
  onBlur,
  onFocus,
  removeItem,
}) => {
  const validColorSchema = getValidColorSchema(color);
  const inputRefs = useRef([]);

  return (
    <Base>
      <TopContainer>
        <ItemLabel colorSchema={validColorSchema} underline={false}>
          {heading || "Item"}
        </ItemLabel>
        <DeleteButton onPress={removeItem}>
          <DeleteButtonText colorSchema={validColorSchema}>
            TA BORT
          </DeleteButtonText>
        </DeleteButton>
      </TopContainer>
      {inputs.map((input, index) => {
        const errorDetails = error?.[input.id]
          ? {
              isValid: error[input.id].isValid,
              message: error[input.id].validationMessage,
            }
          : undefined;
        const showErrorMessage = !error?.[input.id]?.isValid;

        const requiredSymbol = input?.validation?.isRequired ? " *" : "";

        return (
          <RepeaterItem
            colorSchema={validColorSchema}
            key={`${input.title}.${index}`}
            style={
              index === inputs.length - 1
                ? { marginBottom: 0 }
                : { marginBottom: 4 }
            }
            error={error && error[input.id] ? error[input.id] : undefined}
            onPress={() => {
              if (inputRefs.current?.[index]?.focus)
                inputRefs.current[index].focus();
              else if (inputRefs.current?.[index]?.togglePicker)
                inputRefs.current[index].togglePicker();
            }}
            activeOpacity={1.0}
            hidden={input.type === "hidden"}
          >
            <InputLabelWrapper>
              <InputLabel
                colorSchema={validColorSchema}
              >{`${input.title}${requiredSymbol}`}</InputLabel>
            </InputLabelWrapper>
            <InputWrapper colorSchema={validColorSchema}>
              <InputComponent
                input={input}
                onChange={changeFromInput(input)}
                error={errorDetails}
                showErrorMessage={showErrorMessage}
                onBlur={onBlur}
                onFocus={onFocus}
                colorSchema={validColorSchema}
                value={value[input.id] || ""}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
              />
            </InputWrapper>
          </RepeaterItem>
        );
      })}
    </Base>
  );
};

export default RepeaterFieldListItem;
