import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { LayoutAnimation, Platform } from 'react-native';
import styled from 'styled-components/native';
import { Button, Fieldset, Input, Text } from '../../atoms';
import Select from '../../atoms/Select';
import CalendarPicker from '../CalendarPicker/CalendarPickerForm';

const EditableListBody = styled.View`
  padding-top: 33px;
  height: auto;
`;

const EditableListItem = styled.TouchableOpacity`
  font-size: ${(props) => props.theme.fontSizes[4]}px;
  flex-direction: row;
  height: auto;
  background-color: transparent;
  border-radius: 4.5px;
  margin-bottom: 14px;
  ${({ theme, error }) =>
    !(error?.isValid || !error) && `border: solid 1px ${theme.colors.primary.red[0]}`}
  ${(props) =>
    props.editable &&
    `background-color: ${props.theme.colors.complementary[props.colorSchema][2]};`};
  ${({ editable }) => editable && Platform.OS === 'ios' && `padding: 16px;`};
`;

const EditableListItemLabelWrapper = styled.View`
  flex: 4;
  justify-content: ${(props) => (props.alignAtStart ? 'flex-start' : 'center')};
`;

const EditableListItemLabel = styled.Text`
  width: 80%;
  font-weight: ${(props) => props.theme.fontWeights[1]};
  color: ${(props) => props.theme.colors.neutrals[1]};
  ${(props) =>
    props.editable &&
    Platform.OS === 'android' &&
    `
    margin: 16px;
    margin-right: 0;
    `};
`;

const EditableListItemInputWrapper = styled.View`
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  flex: 5;
`;

// eslint-disable-next-line prettier/prettier
const EditableListItemInput = styled(Input)`
  text-align: right;
  min-width: 80%;
  font-weight: 500;
  padding: 0px;
  color: ${(props) => props.theme.colors.neutrals[1]};
  ${(props) =>
    props.editable &&
    Platform.OS === 'android' &&
    `
    margin: 16px;
    margin-left: 0;
      `};
`;

const EditableListItemSelect = styled(Select)`
  min-width: 80%;
  font-weight: 500;
  margin-bottom: 0px;
  ${(props) =>
    props.editable &&
    Platform.OS === 'android' &&
    `
    margin: 16px;
    margin-left: 0;
  `};
`;

const FieldsetButton = styled(Button)`
  margin-left: 26px;
`;

const getInitialState = (inputs, value) => {
  if (value && typeof value === 'object') {
    return inputs.reduce((prev, current) => ({ ...prev, [current.key]: value[current.key] }), {});
  }
  return inputs.reduce((prev, current) => ({ ...prev, [current.key]: current.value }), {});
};

const StyledErrorText = styled(Text)`
  padding-bottom: 20px;
  color: ${(props) => props.theme.textInput.errorTextColor};
`;

/** Switch between different input types */
const InputComponent = React.forwardRef(
  ({ input, colorSchema, editable, onChange, onInputBlur, value, state }, ref) => {
    switch (input.type) {
      case 'number':
        return (
          <EditableListItemInput
            colorSchema={colorSchema}
            editable={editable}
            onChangeText={(text) => onChange(input.key, text)}
            onBlur={onInputBlur}
            value={value && value !== '' ? value[input.key] : state[input.key]}
            keyboardType="numeric"
            transparent
            inputType={input.inputSelectValue}
            ref={ref}
          />
        );
      case 'date':
        return (
          <CalendarPicker
            value={value && value !== '' ? value[input.key] : state[input.key]}
            onSelect={(date) => onChange(input.key, date)}
            onBlur={onInputBlur}
            editable={editable}
            transparent
          />
        );
      case 'select':
        return (
          <EditableListItemSelect
            onBlur={onInputBlur}
            onValueChange={(value) => onChange(input.key, value)}
            value={value && value !== '' ? value[input.key] : state[input.key]}
            editable={editable}
            items={input?.items || []}
            ref={ref}
          />
        );
      default:
        return (
          <EditableListItemInput
            colorSchema={colorSchema}
            editable={editable}
            onChangeText={(text) => onChange(input.key, text)}
            onBlur={onInputBlur}
            value={value && value !== '' ? value[input.key] : state[input.key]}
            transparent
            inputType={input.inputSelectValue}
            ref={ref}
          />
        );
    }
  }
);
InputComponent.propTypes = {
  input: PropTypes.shape({
    label: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    items: PropTypes.array,
    inputSelectValue: PropTypes.string,
    disabled: PropTypes.bool,
  }),
  colorSchema: PropTypes.oneOf(['red', 'blue', 'green', 'purple', 'neutral']),
  editable: PropTypes.bool,
  onChange: PropTypes.func,
  onInputBlur: PropTypes.func,
  value: PropTypes.object,
  state: PropTypes.object,
};

/**
 * EditableList
 * A Molecule Component to use for rendering a list with the possibility of editing the list values.
 */
function EditableList({
  colorSchema,
  title,
  inputs,
  value,
  onInputChange,
  onBlur,
  inputIsEditable,
  startEditable,
  help,
  error,
}) {
  const [editable, setEditable] = useState(startEditable);
  const [state, setState] = useState(getInitialState(inputs, value));
  const inputRefs = useRef([]);

  const changeEditable = () => {
    LayoutAnimation.configureNext({
      duration: 250,
      create: {
        duration: 250,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        duration: 250,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });
    setEditable(!editable);
  };

  const onChange = (key, text) => {
    const updatedState = JSON.parse(JSON.stringify(state));
    updatedState[key] = text;
    onInputChange(updatedState);
    setState(updatedState);
  };
  const onInputBlur = () => {
    if (onBlur) onBlur(state);
  };

  const handleListItemPress = (index) => {
    if (editable && inputRefs.current?.[index]?.focus) inputRefs.current[index].focus();
    else if (editable && inputRefs.current?.[index]?.togglePicker)
      inputRefs.current[index].togglePicker();
  };

  const isInputValid = (input) => error && error[input.key]?.isValid === false;

  return (
    <Fieldset
      colorSchema={colorSchema}
      legend={title || ''}
      help={help}
      renderHeaderActions={() => (
        <>
          {inputIsEditable && (
            <FieldsetButton colorSchema={colorSchema} z={0} size="small" onClick={changeEditable}>
              <Text>{editable ? 'Stäng' : 'Ändra'}</Text>
            </FieldsetButton>
          )}
        </>
      )}
    >
      <EditableListBody>
        {inputs.map((input, index) => [
          <EditableListItem
            colorSchema={colorSchema}
            editable={editable && !input.disabled}
            key={`${input.key}-${index}`}
            error={error ? error[input.key] : undefined}
            activeOpacity={1.0}
            onPress={() => handleListItemPress(index)}
          >
            <EditableListItemLabelWrapper alignAtStart={input.type === 'select'}>
              <EditableListItemLabel editable={editable}>{input.label}</EditableListItemLabel>
            </EditableListItemLabelWrapper>
            <EditableListItemInputWrapper>
              <InputComponent
                {...{ input, colorSchema, onChange, onInputBlur, value, state }}
                editable={editable && !input.disabled}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
              />
            </EditableListItemInputWrapper>
          </EditableListItem>,
          isInputValid(input) && (
            <StyledErrorText>{error[input.key].validationMessage}</StyledErrorText>
          ),
        ])}
      </EditableListBody>
    </Fieldset>
  );
}

EditableList.propTypes = {
  value: PropTypes.object,
  onInputChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  title: PropTypes.string.isRequired,
  inputs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ),
  inputIsEditable: PropTypes.bool,
  startEditable: PropTypes.bool,
  /** Validation error object */
  error: PropTypes.object,
  /**
   * Show a help button
   */
  help: PropTypes.shape({
    text: PropTypes.string,
    size: PropTypes.number,
    heading: PropTypes.string,
    tagline: PropTypes.string,
    url: PropTypes.string,
  }),
  /**
   * The color schema/theme of the component, default is blue.
   */
  colorSchema: PropTypes.oneOf(['blue', 'green', 'red', 'purple']),
};

EditableList.defaultProps = {
  inputIsEditable: true,
  startEditable: false,
  inputs: [],
  colorSchema: 'blue',
};

export default EditableList;
