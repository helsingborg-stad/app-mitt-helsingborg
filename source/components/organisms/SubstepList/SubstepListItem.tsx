/* eslint-disable no-nested-ternary */
import React from 'react';
import { View } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Input, Text, Icon } from '../../atoms';
import SubstepButton from '../../molecules/SubstepButton/SubstepButton';
import colors from '../../../styles/colors';
import { Item, ShownField } from './SubstepList';

const ItemWrapper = styled(View)`
  flex-direction: row;
  align-items: flex-end;
  height: 46px;
`;
const InputWrapper = styled.View`
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  padding-left: 50px;
`;
const TextWrapper = styled.View`
  align-items: flex-end;
  justify-content: flex-end;
  flex: 10;
  padding-left: 0px;
`;
const SmallInput = styled(Input)`
  height: 40px;
  padding-top: 8px;
  padding-bottom: 8px;
`;
const SmallText = styled(Text)`
  height: 40px;
  font-size: 14px;
  padding-top: 11px;
  padding-bottom: 8px;
  padding-left: 17px;
`;
const DeleteButton = styled(Icon)`
  padding-top: 5px;
  padding-left: 5px;
  padding-right: 0px;
  margin-left: 5px;
  margin-right: 0px;
  margin-bottom: 15px;
  color: black;
`;

interface Props {
  item: Item;
  shownField: ShownField;
  value: Record<string, any>;
  updateAnswer: (key: string) => void;
  changeFromInput: (item: Item, shownField: ShownField) => (text: string) => void;
  removeItem: (item: Item, shownField: ShownField) => () => void;
  color: string;
  editable: boolean;
  summary: boolean;
}

const SubstepListItem: React.FC<Props> = ({
  item,
  shownField,
  value,
  updateAnswer,
  changeFromInput,
  removeItem,
  color,
  editable,
  summary,
}) => (
  <ItemWrapper key={`${item.title}`}>
    {editable && !summary ? (
      <>
        <SubstepButton
          text={shownField.heading}
          value={value[item.key] || {}}
          onChange={updateAnswer(item.key)}
          formId={item.formId}
          color={colors.substepList[color].listButtonColor}
          size="small"
        />
        <InputWrapper>
          <SmallInput
            textAlign="right"
            keyboardType="numeric"
            value={value[item.key][shownField.fieldId]}
            onChangeText={changeFromInput(item, shownField)}
          />
        </InputWrapper>
        <TouchableHighlight activeOpacity={1} onPress={removeItem(item, shownField)}>
          <DeleteButton name="clear" />
        </TouchableHighlight>
      </>
    ) : editable && summary ? (
      <>
        <SmallText>{shownField.heading}</SmallText>
        <TextWrapper>
          <InputWrapper>
            <SmallInput
              textAlign="right"
              keyboardType="numeric"
              value={value[item.key][shownField.fieldId]}
              onChangeText={changeFromInput(item, shownField)}
            />
          </InputWrapper>
        </TextWrapper>
      </>
    ) : (
      <>
        <SmallText>{shownField.heading}</SmallText>
        <TextWrapper>
          <SmallText>
            {value[item.key][shownField.fieldId]
              ? `${value[item.key][shownField.fieldId]} kr`
              : '0 kr'}
          </SmallText>
        </TextWrapper>
      </>
    )}
  </ItemWrapper>
);

SubstepListItem.propTypes = {
  /**
   * The header text of the list.
   */
  item: PropTypes.any,
  shownField: PropTypes.any,
  /**
   * The values of the entire list object
   */
  value: PropTypes.object,
  /**
   * What should happen to update the values
   */
  updateAnswer: PropTypes.func,
  changeFromInput: PropTypes.func,
  removeItem: PropTypes.func,
  /**
   * If the list acts as a summary; default is false.
   */
  summary: PropTypes.bool,
  /**
   * If the list should be editable, default is false.
   */
  editable: PropTypes.bool,
  /**
   * Sets the color scheme of the list. default is red.
   */
  color: PropTypes.string,
};
SubstepListItem.defaultProps = {
  summary: false,
  editable: false,
  color: 'light',
  updateAnswer: () => {},
};
export default SubstepListItem;
