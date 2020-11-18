import React, { useState } from 'react';
import { StyleProp, TextStyle, LayoutAnimation, Platform } from 'react-native';
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

const PickerWrapper = styled.View<{transparent?: boolean}>`
  background: ${({transparent, theme}) => transparent ? 'transparent' : theme.picker.background}; ;
`;

const PickerAcessoryWrapper = styled.View<{transparent?: boolean}>`
  border-bottom-width: 1px;
  background: ${({transparent, theme}) => transparent ? 'transparent' : theme.picker.background};;
  border-color: ${props => props.theme.picker.accessory.border};
`;

interface Props {
  items: { label: string; value: string }[];
  onValueChange: (value: string, index?: number) => void;
  placeholder?: string;
  value: string;
  editable?: boolean;
  transparent?: boolean;
  style?: StyleProp<TextStyle>;
}

const Select: React.FC<Props> = ({
  items,
  onValueChange,
  placeholder,
  value,
  editable = true,
  transparent,
  style,
}) => {
  const currentItem = items.find(item => item.value === value);
  const [showPicker, setShowPicker] = useState(false);

  // The picker works differently on android vs ios, so this kind of trick is needed to make the design at least somewhat close. 
  if (Platform.OS === 'android')
    return (
      <Picker
        style={{ minWidth: 150, transform: [
          { scaleX: 0.8 }, 
          { scaleY: 0.8 },
       ]}} // The scaling transform here is a bit of a hack, since the itemStyle prop does not work on android
        mode="dropdown"
        enabled={editable}
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
    );
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
      {showPicker && editable && (
        <PickerWrapper transparent={transparent}>
          <PickerAcessoryWrapper transparent={transparent}>
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
            style={{ minWidth: 150}} 
            enabled={editable}
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
  )
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
