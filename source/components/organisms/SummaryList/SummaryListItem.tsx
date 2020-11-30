/* eslint-disable no-nested-ternary */
import React from "react";
import { View, TextInput } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import { Text, Icon, Checkbox } from "../../atoms";
import { SummaryListItem as SummaryListItemType } from "./SummaryList";
import moment from 'moment';
import CalendarPicker from '../../molecules/CalendarPicker/CalendarPickerForm';
import { colorPalette } from '../../../styles/palette';

interface ItemWrapperProps {
  error?: { isValid: boolean; validationMessage: string; };
  colorSchema: string;
  editable: boolean;
}

/**
 * Fixes a bug in React Native that makes input fields not scrollable inside ScrollViews on Android
 * Issue: https://github.com/facebook/react-native/issues/25594
 * @param props
 */
const TextInputRight = (props) =>
  <TextInput {...props} multiline={true} numberOfLines={1} textAlign="right" />;

const Row = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const ItemWrapper = styled(View) <ItemWrapperProps>`
  flex: 10;
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

const SmallInput = styled(TextInputRight)`
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
  padding-top: 0px;
  padding-left: 5px;
  padding-right: 5px;
  padding-bottom: 20px;
  margin-left: 0px;
  margin-right: 0px;
  margin-bottom: 12px;
  margin-top: 0px;
  color: ${props => props.theme.colors.neutrals[4]};
`;
const DeleteButtonHighligth = styled(TouchableHighlight)`
  padding: 0;
  margin: 0;
`;
interface Props {
  item: SummaryListItemType;
  value: Record<string, any> | string | number | boolean;
  index?: number;
  editable?: boolean;
  changeFromInput: (value: string | number | boolean) => void;
  onBlur?: (value: Record<string, any> | string | number | boolean) => void;
  removeItem: () => void;
  color: string;
  validationError?: { isValid: boolean; message: string };
}
/** The rows for the summary list. */
const SummaryListItem: React.FC<Props> = ({
  item,
  value,
  index,
  changeFromInput,
  onBlur,
  editable,
  removeItem,
  color,
  validationError,
}) => {
  const onInputBlur = () => {
    if(onBlur) onBlur(value);
  }
  const inputComponent = (input: SummaryListItemType, editable: boolean) => {
    switch (input.type) {
      case 'text':
      case 'arrayText':
        return (
          <SmallInput
            value={value as string}
            onChangeText={changeFromInput}
            onBlur={onInputBlur}
            editable={editable}
          />
        );
      case 'number':
      case 'arrayNumber':
        return (
          <SmallInput
            keyboardType="numeric"
            value={value as string}
            onBlur={onInputBlur}
            onChangeText={changeFromInput}
            editable={editable}
          />
        );
      case 'date':
      case 'arrayDate':
        return (
          <CalendarPicker
            value={value as string}
            onSelect={changeFromInput}
            editable={editable}
            transparent
            style={ {paddingRight: 10, paddingTop:5, paddingBottom:5}}
          />
        );
      case 'checkbox':
        const checked = value as boolean;
        return (
          <Checkbox checked={checked} color={color} disabled={!editable} onChange={() => changeFromInput(!checked)} />
        )
      default:
        return (
          <SmallInput
            value={value as string}
            onBlur={onInputBlur}
            onChangeText={changeFromInput}
            editable={editable}
          />
        );
    }
  };
  // TODO: we probably want to change how the color prop is handled in the future.
  const colorSchema = Object.keys(colorPalette.primary).includes(color) ? color : 'blue';
  return (
    <Row>
      <ItemWrapper key={`${item.title}`} colorSchema={colorSchema} editable={editable} error={validationError}>
        <LabelWrapper>
          <SmallText>
            {`${item.title}`}
            {index ? ` ${index}` : null}
          </SmallText>
        </LabelWrapper>
        <InputWrapper>{inputComponent(item, editable)}</InputWrapper>
      </ItemWrapper>
      { editable &&
        (<DeleteButtonHighligth
          activeOpacity={0.6}
          underlayColor={colorPalette.complementary[colorSchema][1]}
          onPress={removeItem}>
          <DeleteButton name="clear" />
        </DeleteButtonHighligth>)}
    </Row>
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
  onBlur: PropTypes.func,
  /**
   * The function to remove the row and clear the associated input
   */
  removeItem: PropTypes.func,
  /**
   * Sets the color scheme of the list. default is red.
   */
  color: PropTypes.string,
  /**
   * Whether or not to make the
   */
  editable: PropTypes.bool,
  validationError: PropTypes.object,
};
SummaryListItem.defaultProps = {
  color: 'blue',
};
export default SummaryListItem;
