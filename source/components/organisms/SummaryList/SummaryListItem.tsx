/* eslint-disable no-nested-ternary */
import React from "react";
import { View } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import { Text, Icon } from "../../atoms";
import { SummaryListItem as SummaryListItemType } from "./SummaryList";
import DateTimePickerForm from "../../molecules/DateTimePicker/DateTimePickerForm";
import {colorPalette} from '../../../styles/palette';
import { CSSProp } from "styled-components";

interface ItemWrapperProps {
  error?: {isValid: boolean; validationMessage: string;};
  colorSchema: string;
  editable: boolean;
}

const ItemWrapper = styled(View)<ItemWrapperProps>`
  font-size: ${props => props.theme.fontSizes[4]}px;
  flex-direction: row;
  height: auto;
  background-color: transparent;
  border-radius: 4.5px;
  margin-bottom: 10px;
  ${({ theme, error }) =>
    !(error?.isValid || !error) && `border: solid 1px ${theme.colors.primary.red[0]}`}
  ${props =>
    props.editable
      ? `
      background-color: ${props.theme.colors.complementary[props.colorSchema][2]};
      padding: 10px;
      `
      : 'color: blue;'};
`;
const InputWrapper = styled.View`
  align-items: center;
  justify-content: center;
  align-items: flex-end;
  flex: 5;
`;
const SmallInput = styled.TextInput`
  text-align: right;
  min-width: 80%;
  font-weight: 500;
  padding: 6px;
`;
const LabelWrapper = styled.View`
  flex: 4;
  justify-content: center;
`
const SmallText = styled(Text)`
  padding: 4px;
  font-weight: ${props => props.theme.fontWeights[1]};
  color: ${props => props.theme.colors.neutrals[2]};
`;
const DeleteButton = styled(Icon)`
  padding-top: 5px;
  padding-left: 0px;
  padding-right: 0px;
  margin-left: 0px;
  margin-right: 0px;
  margin-bottom: 15px;
  color: black;
`;
const dateStyle: CSSProp = {
  textAlign: 'right',
  minWidth: '80%',
  fontWeight: 500,
  padding: 6,
};

interface Props {
  item: SummaryListItemType;
  value: Record<string, any> | string | number;
  index?: number;
  editable?: boolean;
  changeFromInput: (text: string | number) => void;
  removeItem: () => void;
  color: string;
  error?: {isValid: boolean; validationMessage: string};
}

const SummaryListItem: React.FC<Props> = ({
  item,
  value,
  index,
  changeFromInput,
  editable,
  removeItem,
  color,
  error,
}) => {
  const inputComponent = (input: SummaryListItemType, editable: boolean) => {
    switch (input.type) {
      case "text":
      case "arrayText":
        return (
          <SmallInput
            textAlign="right"
            value={value as string}
            onChangeText={changeFromInput}
            editable={editable}
          />
        );
      case "number":
      case "arrayNumber":
        return (
          <SmallInput
            textAlign="right"
            keyboardType="numeric"
            value={value as string}
            onChangeText={changeFromInput}
            editable={editable}
          />
        );
      case "date":
      case "arrayDate":
        return (
          <DateTimePickerForm
            value={value as string}
            mode="date"
            selectorProps={{ locale: "sv" }}
            onSelect={changeFromInput}
            color={color}
            style={dateStyle}
            editable={editable}
          />
        );
      default:
        return (
          <SmallInput
            textAlign="right"
            value={value as string}
            onChangeText={changeFromInput}
            editable={editable}
          />
        );
    }
  };
  const colorSchema = Object.keys(colorPalette).includes(color) ? color : 'blue';
  return (
    <ItemWrapper key={`${item.title}`} colorSchema={colorSchema} editable={editable} error={error}>
      <LabelWrapper>
        <SmallText>
        {`${item.title}`}
        {index ? ` ${index}` : null}
      </SmallText>
      </LabelWrapper>
      <InputWrapper>{inputComponent(item, editable)}</InputWrapper>
      { editable && <TouchableHighlight activeOpacity={1} onPress={removeItem}>
        <DeleteButton name="clear" />
  </TouchableHighlight> }
    </ItemWrapper>
  );
};
SummaryListItem.propTypes = {
  /**
   * The header text of the list.
   */
  item: PropTypes.any,
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
SummaryListItem.defaultProps = {
  color: "blue",
};
export default SummaryListItem;
