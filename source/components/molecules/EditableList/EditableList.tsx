import React, { useRef, useState } from "react";

import { Fieldset, Text } from "../../atoms";

import { deepCopy } from "../../../helpers/Objects";

import InputComponent from "./InputComponent";

import {
  EditableListBody,
  EditableListItem,
  EditableListItemLabelWrapper,
  EditableListItemLabel,
  EditableListItemInputWrapper,
  FieldsetButton,
  StyledErrorText,
  configureNextLayoutAnimation,
} from "./EditableList.styled";

import type { Props, Input, Answer } from "./EditableList.types";

const getInitialState = (inputs: Input[], value: Answer): Answer => {
  if (value && typeof value === "object") {
    return inputs.reduce(
      (prev, currentInput) => ({
        ...prev,
        [currentInput.key]: value[currentInput.key],
      }),
      {} as Answer
    );
  }
  return inputs.reduce(
    (prev, current) => ({ ...prev, [current.key]: current.inputSelectValue }),
    {}
  );
};

function EditableList({
  colorSchema = "blue",
  title,
  inputs = [],
  value,
  onInputChange,
  onBlur,
  inputIsEditable = true,
  startEditable = false,
  help,
  error,
  onFocus,
}: Props): JSX.Element {
  const [editable, setEditable] = useState(startEditable);
  const [state, setState] = useState(getInitialState(inputs, value));
  const inputRefs = useRef([]);

  const changeEditable = () => {
    configureNextLayoutAnimation();
    setEditable((oldValue) => !oldValue);
  };

  const onChange = (key: string, text: string | number) => {
    const updatedState = deepCopy(state);
    updatedState[key] = text;
    onInputChange(updatedState);
    setState(updatedState);
  };
  const onInputBlur = () => {
    if (onBlur) onBlur(state);
  };

  const onInputFocus = (
    event: unknown = undefined,
    index: number,
    isSelect = false
  ) => {
    if (onFocus) {
      const target = inputRefs.current[index].inputRef;
      onFocus(event || { target }, isSelect);
    }
  };
  const onInputScrollTo = (event: any, index: number, isSelect = false) =>
    onInputFocus(event, index, isSelect);

  const handleListItemPress = (index: number) => {
    if (editable && inputRefs.current?.[index]?.focus)
      inputRefs.current[index].focus();
    else if (editable && inputRefs.current?.[index]?.togglePicker)
      inputRefs.current[index].togglePicker();
  };

  const isInputValid = (input: Input) =>
    error && error[input.key]?.isValid === false;

  return (
    <Fieldset
      colorSchema={colorSchema}
      legend={title || ""}
      help={help}
      renderHeaderActions={() => (
        <>
          {inputIsEditable && (
            <FieldsetButton
              colorSchema={colorSchema}
              z={0}
              size="small"
              onClick={changeEditable}
            >
              <Text>{editable ? "Stäng" : "Ändra"}</Text>
            </FieldsetButton>
          )}
        </>
      )}
    >
      <EditableListBody>
        {inputs.map((input, index) => {
          const requiredSymbol = input.validation.isRequired ? " *" : "";
          return [
            <EditableListItem
              colorSchema={colorSchema}
              editable={editable && !input.disabled}
              key={`${input.key}-${input.inputSelectValue}`}
              error={error ? error[input.key] : undefined}
              activeOpacity={1.0}
              onPress={() => handleListItemPress(index)}
            >
              <EditableListItemLabelWrapper
                alignAtStart={input.type === "select"}
              >
                <EditableListItemLabel editable={editable}>
                  {`${input.label}${requiredSymbol}`}
                </EditableListItemLabel>
              </EditableListItemLabelWrapper>
              <EditableListItemInputWrapper>
                <InputComponent
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  input={input}
                  colorSchema={colorSchema}
                  onChange={onChange}
                  onInputBlur={onInputBlur}
                  value={value}
                  state={state}
                  editable={editable && !input.disabled}
                  onInputFocus={(event: unknown, isSelect: boolean) =>
                    onInputFocus(event, index, isSelect)
                  }
                  onClose={(event: unknown, isSelect: boolean) =>
                    onInputScrollTo(event, index, isSelect)
                  }
                />
              </EditableListItemInputWrapper>
            </EditableListItem>,
            isInputValid(input) && (
              <StyledErrorText>
                {error[input.key].validationMessage}
              </StyledErrorText>
            ),
          ];
        })}
      </EditableListBody>
    </Fieldset>
  );
}
export default EditableList;
