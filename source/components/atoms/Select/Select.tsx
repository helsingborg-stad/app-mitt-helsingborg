import React from "react";
import { StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Icon from "react-native-vector-icons/Entypo";

import type { PickerStyle } from "react-native-picker-select";

import {
  Wrapper,
  InputRowWrapper,
  InputRowTextWrapper,
  InputRowIconWrapper,
  StyledErrorText,
} from "./Select.styled";

import theme from "../../../theme/theme";

import type { Props } from "./Select.types";

const pickerSelectStyles: PickerStyle = StyleSheet.create({
  inputIOS: {
    paddingHorizontal: 10,
    textAlign: "right",
    color: theme.colors.neutrals[1],
    paddingRight: 15,
  },
  inputAndroid: {
    paddingHorizontal: 10,
    textAlign: "right",
    color: theme.colors.neutrals[1],
    paddingRight: 15,
  },
  iconContainer: {
    height: "100%",
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
      <InputRowWrapper>
        <InputRowTextWrapper>
          <RNPickerSelect
            style={pickerSelectStyles}
            placeholder={{ label: placeholder, value: null }}
            disabled={!editable}
            value={currentItem?.value || null}
            onValueChange={handleValueChange}
            items={items}
            ref={ref}
            Icon={() => (
              <InputRowIconWrapper>
                <Icon name="select-arrows" />
              </InputRowIconWrapper>
            )}
            doneText="Klar"
            onOpen={handleOpen}
            onClose={handleClose}
            useNativeAndroidPickerStyle={false}
          />
        </InputRowTextWrapper>
      </InputRowWrapper>
      {showErrorMessage && error ? (
        <StyledErrorText>{error?.message}</StyledErrorText>
      ) : null}
    </Wrapper>
  );
}

export default React.forwardRef<RNPickerSelect, Props>(Select);
