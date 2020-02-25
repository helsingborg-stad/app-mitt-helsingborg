import React, { Component } from 'react';
import { Picker } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

import Text from '../Text';
import Input from '../Input';

export default class Select extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentValue: '',
      showPicker: false,
    };
  }

  render() {
    const { items, style, onValueChange, placeholder } = this.props;
    const { currentValue, showPicker } = this.state;

    const currentItem = items.find(item => item.value === currentValue);

    return (
      <>
        <SelectInput
          style={style}
          placeholder={placeholder}
          editable={false}
          onTouchStart={() => {
            this.setState(prevState => ({ showPicker: true }));
          }}
          onChange={nativeEvent => {
            console.log(nativeEvent);
          }}
          value={currentItem ? currentItem.label : ''}
        />

        {showPicker ? (
          <PickerWrapper>
            <PickerAcessoryWrapper>
              <PickerAcessoryLink
                accessibilityRole="button"
                onPress={() => {
                  this.setState(prevState => ({ showPicker: false }));
                }}
              >
                Done
              </PickerAcessoryLink>
            </PickerAcessoryWrapper>
            <Picker
              selectedValue={currentValue}
              onValueChange={(itemValue, itemIndex) => {
                if (typeof onValueChange === 'function') {
                  onValueChange(itemValue);
                }
                this.setState({ currentValue: itemValue });
              }}
            >
              <Picker.Item label={placeholder} value="" color="gray" />
              {items.map((item, index) => (
                <Picker.Item label={item.label} value={item.value} key={`${index}-${item.value}`} />
              ))}
            </Picker>
          </PickerWrapper>
        ) : null}
      </>
    );
  }
}

Select.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ).isRequired,
  onValueChange: PropTypes.func,
  placeholder: PropTypes.string,
  style: PropTypes.shape({}),
};

Select.defaultProps = {
  placeholder: 'Select an item',
};

const SelectInput = styled(Input)`
  flex: 0 1 auto;
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
