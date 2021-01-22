/* eslint-disable no-nested-ternary */
import React, {useRef} from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Text, Input } from '../../atoms';
import Button from '../../atoms/Button';
import Label from '../../atoms/Label';
import { InputRow } from './RepeaterField';
import CalendarPicker from '../CalendarPicker/CalendarPickerForm';
import theme from '../../../styles/theme';
import { getValidColorSchema, PrimaryColor } from '../../../styles/themeHelpers';

const Base = styled.View`
  padding: 0px;
  margin-bottom: 5px;
  flex-direction: column;
  border-radius: 6px;
`;

const RepeaterItem = styled.TouchableOpacity<{colorSchema: string; error: Record<string, any>}>`
  font-size: ${props => props.theme.fontSizes[4]}px;
  flex-direction: row;
  height: auto;
  background-color: transparent;
  border-radius: 4.5px;
  margin-bottom: 10px;
  ${({ theme, error }) =>
    !(error?.isValid || !error) && `border: solid 1px ${theme.colors.primary.red[0]}`};
  background-color: ${props => props.theme.repeater[props.colorSchema].inputBackground};
  padding: 10px;
`;

const ItemLabel = styled(Label)<{colorSchema: string}>`
  margin-top: 20px;
  margin-left: 10px;
  font-size: 12px;
  margin-bottom: 0px;
  padding-bottom: 0px;
  color: ${props => props.theme.repeater[props.colorSchema].inputText};
`

const InputLabelWrapper = styled.View`
  flex: 4;
  justify-content: center;
`;

const InputLabel = styled.Text<{colorSchema: string}>`
  padding: 4px;
  font-weight: ${props => props.theme.fontWeights[1]};
  color: ${props => props.theme.repeater[props.colorSchema].inputText};
`;

const InputWrapper = styled.View<{colorSchema: string}>`
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  flex: 5;
`;
// eslint-disable-next-line prettier/prettier
const ItemInput = styled(Input)`
  text-align: right;
  min-width: 80%;
  font-weight: 500;
  color: ${props => props.theme.repeater[props.colorSchema].inputText};
  padding: 5px;
`;
const DeleteButton = styled(Button)<{color: string}>`
  margin-top: 10px;
  margin-bottom: 10px;
  background: ${props => theme.repeater[props.color].deleteButton};
`;

const DeleteButtonText = styled(Text)<{color: string}>`
  color: ${props => theme.repeater[props.color].deleteButtonText};
  text-transform: uppercase;
  font-weight: 900;
  font-size: 12px;
  line-height: 18px;
`;

interface InputComponentProps {
  input: InputRow;
  colorSchema: PrimaryColor;
  value: string | number | boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

const InputComponent = React.forwardRef(({input, colorSchema, value, onChange, onBlur }: InputComponentProps, ref) => {
  switch (input.type) {
    case 'text':
      return (
        <ItemInput
          textAlign="right"
          colorSchema={colorSchema}
          value={value.toString()}
          onChangeText={onChange}
          onBlur={onBlur}
          transparent
          inputType={input.inputSelectValue}
          ref={ref}
        />
      );
    case 'number':
      return (
        <ItemInput
          textAlign="right"
          colorSchema={colorSchema}
          keyboardType="numeric"
          value={value.toString()}
          onChangeText={onChange}
          onBlur={onBlur}
          transparent
          inputType={input.inputSelectValue}
          ref={ref}
        />
      );
    case 'date':
      return (
        <CalendarPicker
          colorSchema={colorSchema}
          value={value as string}
          onSelect={onChange}
          editable={true}
          transparent
        />
      );
    default:
      return (
        <ItemInput
          colorSchema={colorSchema}
          textAlign="right"
          value={value.toString()}
          onChangeText={onChange}
          onBlur={onBlur}
          transparent
          inputType={input.inputSelectValue}
          ref={ref}
        />
      );
  }
});


interface Props {
  heading?: string;
  listIndex?: number;
  inputs: InputRow[];
  value: Record<string, string | number>;
  error?: Record<string, {isValid: boolean, validationMessage: string}>;
  changeFromInput: (input: InputRow) => (text: string) => void;
  onBlur?: () => void;
  removeItem: () => void;
  color: string;
}

const RepeaterFieldListItem: React.FC<Props> = ({
  heading,
  inputs,
  value,
  error,
  changeFromInput,
  onBlur,
  removeItem,
  color,
}) => {
  const validColorSchema = getValidColorSchema(color);
  const inputRefs = useRef([]);

  return (
    <Base>
      <ItemLabel colorSchema={validColorSchema} underline={false}>{heading || "Item"}</ItemLabel>
      {inputs.map((input, index) => (
        <RepeaterItem
          colorSchema={validColorSchema}
          key={`${input.title}.${index}`}
          style={index === inputs.length - 1 ? { marginBottom: 0 } : { marginBottom: 4 }}
          error={error && error[input.id] ? error[input.id] : undefined}
          onPress={ () => {
            if (inputRefs.current?.[index]?.focus)
              inputRefs.current[index].focus();
            else if (inputRefs.current?.[index]?.togglePicker)
              inputRefs.current[index].togglePicker();
          }}
          activeOpacity={1.0}
        >
          <InputLabelWrapper>
            <InputLabel colorSchema={validColorSchema}>{`${input.title}`}</InputLabel>
          </InputLabelWrapper>
          <InputWrapper colorSchema={validColorSchema}>
            <InputComponent 
              input={input} 
              onChange={changeFromInput(input)} 
              onBlur={onBlur} 
              colorSchema={validColorSchema}
              value={(value[input.id]) || ''}
              ref={(el) => {inputRefs.current[index] = el;}}
              />
            </InputWrapper>
        </RepeaterItem>
      ))}
      <DeleteButton z={0} colorSchema="neutral" color={validColorSchema} block onClick={removeItem}>
        <DeleteButtonText color={validColorSchema}>Ta bort</DeleteButtonText>
      </DeleteButton>
    </Base>
  );
};
RepeaterFieldListItem.propTypes = {
  /**
   * The header text of the list.
   */
  heading: PropTypes.string,
  inputs: PropTypes.any,
  value: PropTypes.any,
  changeFromInput: PropTypes.func,
  removeItem: PropTypes.func,
  /**
   * Default is blue.
   */
  color: PropTypes.string,
};
RepeaterFieldListItem.defaultProps = {
  color: 'blue',
};
export default RepeaterFieldListItem;
