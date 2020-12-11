import React from 'react';
import { ViewStyle, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import RNPickerSelect from 'react-native-picker-select';
import theme from '../../../styles/theme';

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

interface Props {
  items: { label: string; value: string }[];
  onValueChange: (value: string, index?: number) => void;
  placeholder?: string;
  value: string;
  editable?: boolean;
  style?: ViewStyle;
}

const Select: React.FC<Props> = ({
  items,
  onValueChange,
  placeholder,
  value,
  editable = true,
  style,
}) => {
  const currentItem = items.find(item => item.value === value);
  return (
    <Wrapper style={style}>
      <RNPickerSelect
        style={pickerSelectStyles}
        placeholder={{ label: placeholder, value: null }}
        disabled={!editable}
        value={currentItem?.value || null}
        onValueChange={(itemValue, _itemIndex) => {
          if (typeof onValueChange === 'function') {
            onValueChange(itemValue ? itemValue.toString() : null);
          }
        }}
        items={items}
      />
    </Wrapper>
  );
};

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
  style: PropTypes.shape({}),
};

Select.defaultProps = {
  placeholder: 'Välj...',
};

export default Select;
