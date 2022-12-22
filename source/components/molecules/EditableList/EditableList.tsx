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
    setEditable(!editable);
  };

  const onChange = (key, text) => {
    const updatedState = deepCopy(state);
    updatedState[key] = text;
    onInputChange(updatedState);
    setState(updatedState);
  };
  const onInputBlur = () => {
    if (onBlur) onBlur(state);
  };

  const onInputFocus = (event, index, isSelect = false) => {
    if (onFocus) {
      const target = inputRefs.current[index].inputRef;
      onFocus(event || { target }, isSelect);
    }
  };
  const onInputScrollTo = (event, index, isSelect = false) =>
    onInputFocus(event, index, isSelect);

  const handleListItemPress = (index) => {
    if (editable && inputRefs.current?.[index]?.focus)
      inputRefs.current[index].focus();
    else if (editable && inputRefs.current?.[index]?.togglePicker)
      inputRefs.current[index].togglePicker();
  };

  const isInputValid = (input) => error && error[input.key]?.isValid === false;

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
              key={`${input.key}-${index}`}
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
                  {...{
                    input,
                    colorSchema,
                    onChange,
                    onInputBlur,
                    value,
                    state,
                  }}
                  editable={editable && !input.disabled}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  onInputFocus={(event, isSelect) =>
                    onInputFocus(event, index, isSelect)
                  }
                  onClose={(event, isSelect) =>
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
