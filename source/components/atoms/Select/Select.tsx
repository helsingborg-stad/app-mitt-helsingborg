import React from "react";
import { StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";

import { Wrapper, StyledErrorText } from "./Select.styled";

import theme from "../../../theme/theme";

import type { Props } from "./Select.types";

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    paddingHorizontal: 10,
    textAlign: "right",
    color: theme.colors.neutrals[1],
    paddingRight: 10,
  },
  inputAndroid: {
    paddingHorizontal: 10,
    textAlign: "right",
    color: theme.colors.neutrals[1],
    paddingRight: 10,
    height: 34,
  },
});

function Select(
  {
    items,
    onValueChange,
    onBlur,
    onOpen,
    onClose,
    placeholder = "Välj...",
    value,
    editable = true,
    showErrorMessage = true,
    error,
    style,
  }: Props,
  ref: React.LegacyRef<RNPickerSelect>
) {
  const currentItem = items.find((item) => item.value === value);
  const handleValueChange = (itemValue: string | number | boolean) => {
    if (onValueChange && typeof onValueChange === "function") {
      onValueChange(itemValue ? itemValue.toString() : null);
    }

    if (itemValue === currentItem?.value) {
      return;
    }

    if (currentItem) {
      onBlur(currentItem.value);
    }
  };

  const handleOpen = () => {
    if (onOpen) onOpen(undefined, true);
  };

  const handleClose = () => {
    if (onClose) onClose(undefined, true);
  };

  return (
    <Wrapper style={style}>
      <RNPickerSelect
        style={pickerSelectStyles}
        placeholder={{ label: placeholder, value: null }}
        disabled={!editable}
        value={currentItem?.value || null}
        onValueChange={handleValueChange}
        items={items}
        ref={ref}
        doneText="Klar"
        onOpen={handleOpen}
        onClose={handleClose}
      />
      {showErrorMessage && error ? (
        <StyledErrorText>{error?.message}</StyledErrorText>
      ) : (
        <></>
      )}
    </Wrapper>
  );
}

export default React.forwardRef<RNPickerSelect, Props>(Select);
