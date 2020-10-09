/* eslint-disable no-nested-ternary */
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Input, Text, Icon } from '../../atoms';
import colors from '../../../styles/colors';
import { InputRow } from './RepeaterField';
import DateTimePickerForm from '../DateTimePicker/DateTimePickerForm';

const Base = styled.View`
  padding: 10px;
  margin-bottom: 5px;
  width: 100%;
  flex-direction: row;
  justify-content: flex-end;
  background-color: gray;
  border-radius: 6px;
  shadow-offset: 0 0;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
`;
const Inputs = styled.View`
  flex-direction: column;
  width: 92%;
`;
const RemoveButton = styled.TouchableHighlight`
  width: 8%;
  background-color: red;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  margin-left: 4px;
`;
const ItemWrapper = styled(View)`
  flex-direction: row;
  align-items: flex-end;
  height: 46px;
  background-color: white;
`;
const InputWrapper = styled.View`
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  padding-left: 50px;
`;
const SmallInput = styled(Input)`
  height: 40px;
  padding-top: 8px;
  padding-bottom: 2px;
  background-color: transparent;
  border: none;
  border-bottom-width: 1px;
  border-color: black;
`;
const SmallText = styled(Text)`
  height: 40px;
  font-size: 14px;
  padding-top: 11px;
  padding-bottom: 8px;
  padding-left: 17px;
`;
const DeleteButton = styled(Icon)`
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;
  color: black;
`;
const dateStyle = {
  height: 40,
  paddingTop: 8,
  paddingBottom: 2,
  backgroundColor: 'transparent',
  borderTopWidth: 0,
  borderStartWidth: 0,
  borderEndWidth: 0,
  borderBottomWidth: 1,
  borderColor: 'black',
};

interface Props {
  inputs: InputRow[];
  value: Record<string, string | number>;
  changeFromInput: (input: InputRow) => (text: string | number) => void;
  removeItem: () => void;
  color: string;
}

const RepeaterFieldListItem: React.FC<Props> = ({
  inputs,
  value,
  changeFromInput,
  removeItem,
  color,
}) => {
  const inputComponent = (input: InputRow) => {
    switch (input.type) {
      case 'text':
        return (
          <SmallInput
            textAlign="right"
            value={value[input.id] || ''}
            onChangeText={changeFromInput(input)}
          />
        );
      case 'number':
        return (
          <SmallInput
            textAlign="right"
            keyboardType="numeric"
            value={value[input.id] || ''}
            onChangeText={changeFromInput(input)}
          />
        );
      case 'date':
        return (
          <DateTimePickerForm
            value={value[input.id]?.toString() || ''}
            mode="date"
            selectorProps={{ locale: 'sv' }}
            onSelect={changeFromInput(input)}
            color={color}
            style={dateStyle}
          />
        );
      default:
        return (
          <SmallInput
            textAlign="right"
            value={value[input.id] || ''}
            onChangeText={changeFromInput(input)}
          />
        );
    }
  };
  const rows = inputs.map((input, index) => (
    <ItemWrapper
      key={`${input.title}.${index}`}
      style={index === inputs.length - 1 ? { marginBottom: 0 } : { marginBottom: 4 }}
    >
      <SmallText>{`${input.title}`}</SmallText>
      <InputWrapper>{inputComponent(input)}</InputWrapper>
    </ItemWrapper>
  ));

  return (
    <Base>
      <Inputs>{rows}</Inputs>

      <RemoveButton activeOpacity={1} onPress={removeItem}>
        <DeleteButton name="clear" />
      </RemoveButton>
    </Base>
  );
};
RepeaterFieldListItem.propTypes = {
  /**
   * The header text of the list.
   */
  inputs: PropTypes.any,
  /**
   * The values of the entire list object
   */
  value: PropTypes.any,
  /**
   * What should happen to update the values
   */
  changeFromInput: PropTypes.func,
  removeItem: PropTypes.func,
  /**
   * Sets the color scheme of the list. default is red.
   */
  color: PropTypes.string,
};
RepeaterFieldListItem.defaultProps = {
  color: 'light',
};
export default RepeaterFieldListItem;
