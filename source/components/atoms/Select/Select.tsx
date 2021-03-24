import React from 'react';
import { ViewStyle, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import RNPickerSelect from 'react-native-picker-select';
import theme from '../../../styles/theme';
import Text from '../Text';

// This library requires styling to follow the pattern here,
// thus we have to use this rather than styled components
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    paddingHorizontal: 10,
    textAlign: 'right',
    color: theme.colors.neutrals[1],
    paddingRight: 10,
  },
  inputAndroid: {
    paddingHorizontal: 10,
    textAlign: 'right',
    color: theme.colors.neutrals[1],
    paddingRight: 10,
  },
});

const Wrapper = styled.View`
  margin-bottom: 30px;
`;

const StyledErrorText = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes[3]}px;
  color: ${(props) => props.theme.textInput.errorTextColor};
  font-weight: ${({ theme }) => theme.fontWeights[0]};
  padding-top: 8px;
`;

interface Props {
  items: { label: string; value: string }[];
  onValueChange: (value: string, index?: number) => void;
  placeholder?: string;
  value: string;
  editable?: boolean;
  style?: ViewStyle;
  onBlur: (value: string) => void;
  showErrorMessage?: boolean;
  error?: { isValid: boolean; message: string };
}

const Select: React.FC<Props> = React.forwardRef(({
  items,
  onValueChange,
  onBlur,
  placeholder,
  value,
  editable = true,
  showErrorMessage = true,
  error,
  style,
}, ref) => {

  const currentItem = items.find(item => item.value === value);
  const handleValueChange = (itemValue: string | number | boolean) => {
    if (onValueChange && typeof onValueChange === 'function') {
      onValueChange(itemValue ? itemValue.toString() : null);
    }

    if (itemValue == currentItem?.value) {
      return;
    }

    if (onBlur) {
      onBlur(currentItem?.value);
    }
  }

  return (
    <Wrapper style={style}>
      <RNPickerSelect
        style={pickerSelectStyles}
        placeholder={{ label: placeholder, value: null }}
        disabled={!editable}
        value={currentItem?.value || null}
        onValueChange={handleValueChange}
        items={items}
        ref={ref as React.LegacyRef<RNPickerSelect>}
      />
      {showErrorMessage && error ? <StyledErrorText>{error?.message}</StyledErrorText> : <></>}
    </Wrapper>
  );
});

Select.propTypes = {
  /** The list of choices */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  /** The value of the selected choice */
  value: PropTypes.string,
  /** Whether or not the dropdown should be changeable. Default is true */
  editable: PropTypes.bool,
  /** Callback for when a new value is selected */
  onValueChange: PropTypes.func,
  /** What to display when no value has been chosen */
  placeholder: PropTypes.string,
  /** Style properties for the inputbox */
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  error: PropTypes.shape({
    isValid: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
  }),
  showErrorMessage: PropTypes.bool,
};

Select.defaultProps = {
  placeholder: 'Välj...',
};

export default Select;
