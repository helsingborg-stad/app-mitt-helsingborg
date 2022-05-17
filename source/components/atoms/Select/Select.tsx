import React from "react";
import { ViewStyle, StyleSheet } from "react-native";
import styled from "styled-components/native";
import RNPickerSelect from "react-native-picker-select";
import theme from "../../../styles/theme";
import Text from "../Text";

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

const Wrapper = styled.View`
  margin-bottom: 30px;
`;

const StyledErrorText = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes[3]}px;
  color: ${({ theme }) => theme.textInput.errorTextColor};
  font-weight: ${({ theme }) => theme.fontWeights[0]};
  padding-top: 8px;
`;

interface SelectProps {
  items: { label: string; value: string }[];
  onValueChange: (value: string | null, index?: number) => void;
  placeholder?: string;
  value: string;
  editable?: boolean;
  style?: ViewStyle;
  onBlur: (value: string | null) => void;
  onOpen: (event: unknown, isSelect: boolean) => void;
  onClose: (event: unknown, isSelect: boolean) => void;
  showErrorMessage?: boolean;
  error?: { isValid: boolean; message: string };
}

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
  }: SelectProps,
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

export default React.forwardRef<RNPickerSelect, SelectProps>(Select);
