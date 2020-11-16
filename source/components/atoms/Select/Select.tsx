import React, { useState } from 'react';
import { StyleProp, TextStyle, LayoutAnimation } from 'react-native';
import { Picker } from '@react-native-community/picker';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Text from '../Text';

const SelectInput = styled.TextInput`
  flex: 5;
  align-items: flex-end;
  justify-content: center;
  text-align: right;
  min-width: 80%;
  font-weight: 500;
  color: ${props => props.theme.colors.neutrals[1]};
  padding: 6px;
`;

const PickerAcessoryLink = styled(Text)`
  align-self: flex-end;
  margin-right: 16px;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const PickerWrapper = styled.View`
  background: ${props => props.theme.picker.background};
`;

const PickerAcessoryWrapper = styled.View`
  border-bottom-width: 1px;
  background: ${props => props.theme.picker.accessory.background};
  border-color: ${props => props.theme.picker.accessory.border};
`;

interface Props {
  items: { label: string; value: string }[];
  onValueChange: (value: string, index?: number) => void;
  placeholder?: string;
  value: string;
  editable?: boolean;
  style?: StyleProp<TextStyle>;
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
  const [showPicker, setShowPicker] = useState(false);
  return (
    <>
      <SelectInput
        value={currentItem ? currentItem.label : ''}
        placeholder={placeholder}
        editable={false}
        onTouchStart={() => {
          if (editable) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setShowPicker(true);
          }
        }}
        style={style}
      />
      {showPicker && (
        <PickerWrapper>
          <PickerAcessoryWrapper>
            <PickerAcessoryLink
              accessibilityRole="button"
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setShowPicker(false);
              }}
            >
              Färdig
            </PickerAcessoryLink>
          </PickerAcessoryWrapper>
          <Picker
            style={{ minWidth: 200 }}
            mode="dropdown"
            selectedValue={currentItem?.value || ''}
            onValueChange={(itemValue, _itemIndex) => {
              if (typeof onValueChange === 'function') {
                onValueChange(itemValue.toString());
              }
            }}
          >
            {items.map((item, index) => (
              <Picker.Item label={item.label} value={item.value} key={`${index}-${item.value}`} />
            ))}
          </Picker>
        </PickerWrapper>
      )}
    </>
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
