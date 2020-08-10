import React from 'react';
import PropTypes from 'prop-types';
import { Input, FieldLabel, Select, Text } from 'source/components/atoms';
import { CheckboxField, EditableList, GroupListWithAvatar } from 'source/components/molecules';
import SubstepList from 'source/components/organisms/SubstepList';
import { View } from 'react-native';
import ConditionalTextField from 'app/components/molecules/ConditinalTextField';
import SubstepButton from '../SubstepButton';
import colors from '../../../styles/colors';
import DateTimePickerForm from '../DateTimePicker';

const inputTypes = {
  text: {
    component: Input,
    changeEvent: 'onChangeText',
  },
  number: {
    component: Input,
    changeEvent: 'onChangeText',
    props: {
      keyboardType: 'numeric',
    },
  },
  date: {
    component: DateTimePickerForm,
    changeEvent: 'onSelect',
    props: {
      mode: 'date',
      selectorProps: { locale: 'sv' },
    },
  },
  list: {},
  checkbox: {
    component: CheckboxField,
    changeEvent: 'onChange',
    props: {},
  },
  editableList: {
    component: EditableList,
    changeEvent: 'onInputChange',
    props: {},
  },
  substepButton: {
    component: SubstepButton,
    changeEvent: 'onChange',
    props: {},
  },
  substepList: {
    component: SubstepList,
    changeEvent: 'onChange',
    props: {},
  },
  substepListSummary: {
    component: SubstepList,
    changeEvent: 'onChange',
    props: { summary: true },
  },
  select: {
    component: Select,
    changeEvent: 'onValueChange',
    props: {},
  },
  avatarList: {
    component: GroupListWithAvatar,
    changeEvent: 'onChange',
    props: {},
  },
  conditionalTextField: {
    component: ConditionalTextField,
    changeEvent: 'onChange',
    props: {},
  },
};

const FormField = props => {
  const { label, labelLine, inputType, color, id, onChange, value, ...other } = props;
  const input = inputTypes[inputType];
  const saveInput = value => {
    onChange({ [id]: value });
  };
  const inputProps = input && input.props ? input.props : {};
  const inputCompProps = { color, value, ...inputProps, ...other };
  if (input && input.changeEvent) inputCompProps[input.changeEvent] = saveInput;

  const inputComponent =
    input && input.component ? (
      React.createElement(input.component, inputCompProps)
    ) : (
      <Text>{`Invalid field type ${inputType}`}</Text>
    );

  return (
    <View>
      {label ? (
        <FieldLabel color={color} underline={labelLine}>
          {label}
        </FieldLabel>
      ) : null}
      {inputComponent}
    </View>
  );
};

FormField.propTypes = {
  /**
   * The label for the input field.
   */
  label: PropTypes.string,
  /**
   * String that determines the input type of the field.
   */
  labelLine: PropTypes.bool,
  /**
   * Unique id for the input field. Used
   */
  id: PropTypes.string,
  /**
   * String that determines the input type of the field.
   */
  inputType: PropTypes.oneOf(Object.keys(inputTypes)),
  /**
   * What happens when the input is changed.
   * Should be used to store inputs to state.
   * Should handle objects on the form { id : value }, where value is the new value and id is the uuid for the input-field.
   */
  onChange: PropTypes.func,
  /**
   * sets the value, since the input field component should be managed.
   */
  value: PropTypes.any,
  /**
   * sets the color theme.
   */
  color: PropTypes.oneOf(Object.keys(colors.formField)),
  /*
   * The function triggers when the button is clicked.
   */
  onClick: PropTypes.func,
};

FormField.defaultProps = {
  onClick: () => {},
  onChange: () => {},
  color: 'light',
  labelLine: true,
  inputType: 'text',
};

export default FormField;
