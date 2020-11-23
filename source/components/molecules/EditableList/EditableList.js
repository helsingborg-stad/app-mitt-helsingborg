import React, { useState } from 'react';
import { LayoutAnimation } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Text, Button, Fieldset } from '../../atoms';
import CalendarPicker from '../CalendarPicker/CalendarPickerForm';

const EditableListBody = styled.View`
  padding-top: 33px;
  height: auto;
`;

const EditableListItem = styled.View`
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

const EditableListItemLabelWrapper = styled.View`
  flex: 4;
  justify-content: center;
`;

const EditableListItemLabel = styled.Text`
  padding: 4px;
  font-weight: ${props => props.theme.fontWeights[1]};
  color: ${props => props.theme.colors.neutrals[1]};
`;

const EditableListItemInputWrapper = styled.View`
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  flex: 5;
`;

// eslint-disable-next-line prettier/prettier
const EditableListItemInput = styled.TextInput`
  text-align: right;
  min-width: 80%;
  font-weight: 500;
  color: ${props => props.theme.colors.neutrals[1]};
  padding: 6px;
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
  inputIsEditable,
  error,
}) {
  const [editable, setEditable] = useState(false);
  const [state, setState] = useState(getInitialState(inputs, value));

  const changeEditable = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setEditable(!editable);
  };

  const onChange = (key, text) => {
    const updatedState = JSON.parse(JSON.stringify(state));
    updatedState[key] = text;
    onInputChange(updatedState);
    setState(updatedState);
  };
  /** Switch between different input types */
  const getInputComponent = input => {
    switch (input.type) {
      case 'number':
        return (
          <EditableListItemInput
            multiline /** Temporary fix to make field scrollable inside scrollview */
            numberOfLines={1} /** Temporary fix to make field scrollable inside scrollview */
            colorSchema={colorSchema}
            editable={editable}
            onChangeText={text => onChange(input.key, text)}
            value={value && value !== '' ? value[input.key] : state[input.key]}
            keyboardType="numeric"
          />
        );
      case 'date':
        return (
          <CalendarPicker
            date={value && value !== '' ? value[input.key] : state[input.key]}
            onSelect={date => onChange(input.key, date)}
            editable={editable}
            transparent
          />
        );
      default:
        return (
          <EditableListItemInput
            multiline /** Temporary fix to make field scrollable inside scrollview */
            numberOfLines={1} /** Temporary fix to make field scrollable inside scrollview */
            colorSchema={colorSchema}
            editable={editable}
            onChangeText={text => onChange(input.key, text)}
            value={value && value !== '' ? value[input.key] : state[input.key]}
          />
        );
    }
  };

  return (
    <Fieldset
      colorSchema={colorSchema}
      legend={title || ''}
      onIconPress={() => console.log('Icon is pressed')}
      iconName="help-outline"
      renderHeaderActions={() =>
        inputIsEditable && (
          <FieldsetButton colorSchema={colorSchema} z={0} size="small" onClick={changeEditable}>
            <Text>{editable ? 'Färdig' : 'Ändra'}</Text>
          </FieldsetButton>
        )
      }
    >
      <EditableListBody>
        {inputs.map(input => (
          <EditableListItem
            colorSchema={colorSchema}
            editable={editable}
            key={input.key}
            error={error ? error[input.key] : undefined}
          >
            <EditableListItemLabelWrapper>
              <EditableListItemLabel>{input.label}</EditableListItemLabel>
            </EditableListItemLabelWrapper>
            <EditableListItemInputWrapper>{getInputComponent(input)}</EditableListItemInputWrapper>
          </EditableListItem>
        ))}
      </EditableListBody>
    </Fieldset>
  );
}

EditableList.propTypes = {
  /**
   * The values
   */
  value: PropTypes.object,
  /**
   * Function for handling input events
   */
  onInputChange: PropTypes.func.isRequired,

  /**
   * The title of the list
   */
  title: PropTypes.string.isRequired,

  /**
   * The inputs that will be rendered
   */
  inputs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ),
  /**
   * Decides of the inputs are editable or not
   */
  inputIsEditable: PropTypes.bool,

  /** Validation error object */
  error: PropTypes.object,

  /**
   * The color schema/theme of the component
   */
  colorSchema: PropTypes.oneOf('blue', 'green', 'red', 'purple'),
};

EditableList.defaultProps = {
  inputIsEditable: true,
  inputs: [],
  colorSchema: 'blue',
};

export default EditableList;
