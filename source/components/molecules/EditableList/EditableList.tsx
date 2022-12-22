import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import { LayoutAnimation } from "react-native";
import { deepCopy } from "../../../helpers/Objects";
import { Fieldset, Text } from "../../atoms";
import CalendarPicker from "../CalendarPicker/CalendarPickerForm";

import {
  EditableListBody,
  EditableListItem,
  EditableListItemLabelWrapper,
  EditableListItemLabel,
  EditableListItemInputWrapper,
  EditableListItemInput,
  EditableListItemSelect,
  FieldsetButton,
  StyledErrorText,
} from "./EditableList.styled";

const getInitialState = (inputs, value) => {
  if (value && typeof value === "object") {
    return inputs.reduce(
      (prev, current) => ({ ...prev, [current.key]: value[current.key] }),
      {}
    );
  }
  return inputs.reduce(
    (prev, current) => ({ ...prev, [current.key]: current.value }),
    {}
  );
};

/** Switch between different input types */
const InputComponent = React.forwardRef(
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
            onClose={onClose ? (event) => onClose(event, true) : null}
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
InputComponent.propTypes = {
  input: PropTypes.shape({
    label: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    items: PropTypes.array,
    inputSelectValue: PropTypes.string,
    disabled: PropTypes.bool,
  }),
  colorSchema: PropTypes.oneOf(["red", "blue", "green", "purple", "neutral"]),
  editable: PropTypes.bool,
  onChange: PropTypes.func,
  onInputBlur: PropTypes.func,
  value: PropTypes.object,
  state: PropTypes.object,
};

/**
 * EditableList
 * A Molecule Component to use for rendering a list with the possibility of editing the list values.
 */
function EditableList({
  colorSchema,
  title,
  inputs,
  value,
  onInputChange,
  onBlur,
  inputIsEditable,
  startEditable,
  help,
  error,
  onFocus,
}) {
  const [editable, setEditable] = useState(startEditable);
  const [state, setState] = useState(getInitialState(inputs, value));
  const inputRefs = useRef([]);

  const changeEditable = () => {
    LayoutAnimation.configureNext({
      duration: 250,
      create: {
        duration: 250,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        duration: 250,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });
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

EditableList.propTypes = {
  value: PropTypes.object,
  onInputChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  title: PropTypes.string.isRequired,
  inputs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ),
  inputIsEditable: PropTypes.bool,
  startEditable: PropTypes.bool,
  /** Validation error object */
  error: PropTypes.object,
  /**
   * Show a help button
   */
  help: PropTypes.shape({
    text: PropTypes.string,
    size: PropTypes.number,
    heading: PropTypes.string,
    tagline: PropTypes.string,
    url: PropTypes.string,
  }),
  /**
   * The color schema/theme of the component, default is blue.
   */
  colorSchema: PropTypes.oneOf(["blue", "green", "red", "purple"]),
  onFocus: PropTypes.func,
};

EditableList.defaultProps = {
  inputIsEditable: true,
  startEditable: false,
  inputs: [],
  colorSchema: "blue",
};

export default EditableList;
