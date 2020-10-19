/* eslint-disable no-nested-ternary */
import React from "react";
import { View } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import { Input, Text, Icon } from "../../atoms";
import colors from "../../../styles/colors";
import { SummaryListItem as SummaryListItemType } from "./SummaryList";
import DateTimePickerForm from "../../molecules/DateTimePicker/DateTimePickerForm";

const SummaryListItemWrapper = styled(View)`
  flex-direction: row;
  align-items: flex-end;
  height: 46px;
`;
const SummaryListInputWrapper = styled.View`
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  padding-left: 50px;
`;
const SummaryListSmallInput = styled(Input)`
  height: 40px;
  padding-top: 8px;
  padding-bottom: 8px;
  background-color: transparent;
  border: none;
  border-bottom-width: 1px;
  border-color: black;
`;
const SummaryListSmallText = styled(Text)`
  height: 40px;
  font-size: 14px;
  padding-top: 11px;
  padding-bottom: 8px;
  padding-left: 17px;
`;
const SummaryListDeleteButton = styled(Icon)`
  padding-top: 5px;
  padding-left: 0px;
  padding-right: 0px;
  margin-left: 0px;
  margin-right: 0px;
  margin-bottom: 15px;
  color: black;
`;
const dateStyle = {
  height: 40,
  paddingTop: 8,
  paddingBottom: 2,
  backgroundColor: "transparent",
  borderTopWidth: 0,
  borderStartWidth: 0,
  borderEndWidth: 0,
  borderBottomWidth: 1,
  borderColor: "black",
};

interface Props {
  item: SummaryListItemType;
  value: Record<string, any> | string | number;
  index?: number;
  changeFromInput: (text: string | number) => void;
  removeItem: () => void;
  color: string;
}

/**
 * A component for rendering an singel item in a SummaryList Component.
 * Each summary item contains input fields with a descriptive label, the ability to clear the inputs and .
 */
const SummaryListItem: React.FC<Props> = ({
  item,
  value,
  index,
  changeFromInput,
  removeItem,
  color,
}) => {
  const inputComponent = (input: SummaryListItemType) => {
    switch (input.type) {
      case "text":
      case "arrayText":
        return (
          <SummaryListSmallInput
            textAlign="right"
            value={value}
            onChangeText={changeFromInput}
          />
        );
      case "number":
      case "arrayNumber":
        return (
          <SummaryListSmallInput
            textAlign="right"
            keyboardType="numeric"
            value={value}
            onChangeText={changeFromInput}
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
          />
        );
      default:
        return (
          <SummaryListSmallInput
            textAlign="right"
            value={value}
            onChangeText={changeFromInput}
          />
        );
    }
  };
  return (
    <SummaryListItemWrapper key={`${item.title}`}>
      <SummaryListSmallText>
        {`${item.title}`}
        {index ? ` ${index}` : null}
      </SummaryListSmallText>
      <SummaryListInputWrapper>{inputComponent(item)}</SummaryListInputWrapper>
      <TouchableHighlight activeOpacity={1} onPress={removeItem}>
        <SummaryListDeleteButton name="clear" />
      </TouchableHighlight>
    </SummaryListItemWrapper>
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
  /** function to remove the item from the list */
  removeItem: PropTypes.func,
  /**
   * Sets the color scheme of the list. default is light.
   */
  color: PropTypes.string,
};
SummaryListItem.defaultProps = {
  color: "light",
};
export default SummaryListItem;
