/* eslint-disable no-nested-ternary */
import PropTypes from "prop-types";
import React, { useRef } from "react";
import { Platform, StyleSheet } from "react-native";
import styled from "styled-components/native";
import { colorPalette } from "../../../styles/palette";
import {
  getValidColorSchema,
  PrimaryColor,
} from "../../../styles/themeHelpers";
import { Icon, Input, Text } from "../../atoms";
import CalendarPicker from "../../molecules/CalendarPicker/CalendarPickerForm";
import { SummaryListItem as SummaryListItemType } from "./SummaryList";

interface ItemWrapperProps {
  error?: { isValid: boolean; message: string };
  colorSchema: string;
  editable: boolean;
}

const Container = styled.View`
  margin-bottom: 10px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ItemWrapper = styled.TouchableOpacity<ItemWrapperProps>`
  flex: 10;
  font-size: ${(props) => props.theme.fontSizes[4]}px;
  flex-direction: row;
  height: auto;
  border-radius: 4.5px;
  ${({ theme, error }) =>
    !(error?.isValid || !error) &&
    `border: solid 1px ${theme.colors.primary.red[0]};`}
  ${(props) =>
    props.editable &&
    `
    background-color: ${
      props.theme.colors.complementary[props.colorSchema][2]
    };`}
  ${({ editable }) =>
    editable &&
    Platform.OS === "ios" &&
    `
    padding: 16px;
  `}
`;

const InputWrapper = styled.View`
  align-items: center;
  justify-content: center;
  align-items: flex-end;
  flex: 5;
`;

const SmallInput = styled(Input)`
  min-width: 80%;
  font-weight: 500;
  color: ${(props) => props.theme.colors.neutrals[1]};
  padding: 0px;
  ${({ editable }) =>
    editable &&
    Platform.OS === "android" &&
    `
    margin: 16px;
    margin-left: 0px;
    `}
`;

const LabelWrapper = styled.View`
  flex: 4;
  justify-content: center;
`;

const SmallText = styled(Text)`
  width: 80%;
  padding: 4px;
  font-weight: ${(props) => props.theme.fontWeights[1]};
  color: ${(props) => props.theme.colors.neutrals[2]};
  ${(props) =>
    props.editable &&
    `
    padding: 0px;
  `}
  ${({ editable }) =>
    editable &&
    Platform.OS === "android" &&
    `
    margin: 16px;
    margin-right: 0px;
  `}
`;

const DeleteButton = styled(Icon)`
  padding-left: 5px;
  margin-bottom: 8px;
  margin-top: 8px;
  color: ${(props) => props.theme.colors.neutrals[4]};
`;

const DeleteButtonHighligth = styled.TouchableHighlight`
  padding: 0px;
  margin: 0px;
`;

const ValidationErrorMessage = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes[3]}px;
  color: ${(props) => props.theme.textInput.errorTextColor};
  font-weight: ${({ theme }) => theme.fontWeights[0]};
  margin-top: 8px;
`;

const FieldStyle: Record<string, unknown> = StyleSheet.create({
  Grey: {
    color: "#707070",
    paddingRight: 0,
  },
  Bold: {
    fontWeight: "bold",
  },
});

interface InputComponentProps {
  input: SummaryListItemType;
  editable: boolean;
  value: string | boolean | number;
  onInputBlur: () => void;
  changeFromInput: (value: string | number | boolean) => void;
  colorSchema: PrimaryColor;
  fieldStyle: Record<string, unknown>;
}

// eslint-disable-next-line react/display-name
const InputComponent = React.forwardRef(
  (
    {
      input,
      editable,
      value,
      onInputBlur,
      changeFromInput,
      colorSchema,
      fieldStyle,
    }: InputComponentProps,
    ref
  ) => {
    switch (input.type) {
      case "text":
      case "arrayText":
        return (
          <SmallInput
            value={value as string}
            onChangeText={changeFromInput}
            onBlur={onInputBlur}
            editable={editable}
            transparent
            textAlign="right"
            inputType={input.inputSelectValue}
            ref={ref}
            style={style}
          />
        );
      case "number":
      case "arrayNumber":
        return (
          <SmallInput
            keyboardType="numeric"
            value={value as string}
            onBlur={onInputBlur}
            onChangeText={changeFromInput}
            editable={editable}
            transparent
            textAlign="right"
            inputType={input.inputSelectValue}
            ref={ref}
            style={fieldStyle}
          />
        );
      case "date":
      case "arrayDate":
        return (
          <CalendarPicker
            colorSchema={colorSchema}
            value={value as number}
            onSelect={changeFromInput}
            editable={editable}
            transparent
            style={{
              paddingRight: 10,
              paddingTop: 5,
              paddingBottom: 5,
              ...fieldStyle,
            }}
          />
        );
      case "checkbox":
        return null;
      default:
        return (
          <SmallInput
            value={value as string}
            onBlur={onInputBlur}
            onChangeText={changeFromInput}
            transparent
            editable={editable}
            textAlign="right"
            inputType={input.inputSelectValue}
            ref={ref}
            style={fieldStyle}
          />
        );
    }
  }
);
interface Props {
  item: SummaryListItemType;
  value: string | number | boolean;
  userDescriptionLabel?: string;
  index?: number;
  editable?: boolean;
  changeFromInput: (value: string | number | boolean) => void;
  onBlur?: (value: Record<string, any> | string | number | boolean) => void;
  removeItem: () => void;
  colorSchema: PrimaryColor;
  validationError?: { isValid: boolean; message: string };
  fieldStyle?: string;
}
/** The rows for the summary list. */
const SummaryListItem: React.FC<Props> = ({
  item,
  value,
  userDescriptionLabel,
  index,
  changeFromInput,
  onBlur,
  editable,
  removeItem,
  colorSchema,
  validationError,
  fieldStyle,
}) => {
  const inputRef = useRef(null);

  const onInputBlur = () => {
    if (onBlur) onBlur(value);
  };

  const customStyle = (() => {
    if (
      fieldStyle &&
      Object.prototype.hasOwnProperty.call(FieldStyle, fieldStyle)
    ) {
      return (FieldStyle[fieldStyle] as Record<string, unknown>) ?? {};
    }
    return {};
  })();
  const validColorSchema = getValidColorSchema(colorSchema);

  return (
    <Container>
      <Row>
        <ItemWrapper
          key={`${item.title}`}
          colorSchema={validColorSchema}
          editable={editable}
          error={validationError}
          onPress={() => {
            if (editable && inputRef.current?.focus) inputRef.current.focus();
            else if (editable && inputRef.current?.togglePicker)
              inputRef.current.togglePicker();
          }}
          activeOpacity={1.0}
        >
          <LabelWrapper>
            <SmallText editable={editable}>
              {userDescriptionLabel || item.title}
            </SmallText>
          </LabelWrapper>
          <InputWrapper editable={editable}>
            <InputComponent
              {...{
                input: item,
                editable,
                value,
                onInputBlur,
                changeFromInput,
                colorSchema: validColorSchema,
                fieldStyle: customStyle,
              }}
              ref={(el) => {
                inputRef.current = el;
              }}
            />
          </InputWrapper>
        </ItemWrapper>
        {editable && (
          <DeleteButtonHighligth
            activeOpacity={0.6}
            underlayColor={colorPalette.complementary[validColorSchema][1]}
            onPress={removeItem}
          >
            <DeleteButton name="clear" />
          </DeleteButtonHighligth>
        )}
      </Row>
      {validationError?.isValid === false && (
        <ValidationErrorMessage>
          {validationError?.message}
        </ValidationErrorMessage>
      )}
    </Container>
  );
};
SummaryListItem.propTypes = {
  item: PropTypes.any,
  /**
   * The values of the entire list object
   */
  value: PropTypes.any,
  changeFromInput: PropTypes.func,
  onBlur: PropTypes.func,
  /**
   * The function to remove the row and clear the associated input
   */
  removeItem: PropTypes.func,
  /**
   * Default is blue
   */
  colorSchema: PropTypes.string,
  editable: PropTypes.bool,
  validationError: PropTypes.object,
  fieldStyle: PropTypes.string,
};
SummaryListItem.defaultProps = {
  colorSchema: "blue",
};
export default SummaryListItem;
