import React from 'react';
import PropTypes from 'prop-types';
import { Input, FieldLabel } from 'source/components/atoms';
import { CheckboxField, EditableList } from 'source/components/molecules';
import { View } from 'react-native';
import SubstepButton from '../SubstepButton';
import colors from '../../../styles/colors';
import ButtonField from '../ButtonField';

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
  date: {}, // To be done as more components are added.
  list: {},
  checkbox: {
    component: CheckboxField,
    changeEvent: 'onChange',
    props: {},
  },
  button: {
    component: ButtonField,
    changeEvent: 'onClick',
    props: {},
  },
  editableList: {
    component: EditableList,
    changeEvent: 'onInputChange',
    props: {},
  },
  substepButton: {
    component: SubstepButton, // SubstepButton,
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

  const inputCompProps = { color, value, ...input.props, ...other };
  inputCompProps[input.changeEvent] = saveInput;

  const inputComponent = React.createElement(input.component, inputCompProps);

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
   * Placeholder, for certain input types (text, number, date).
   * For checkbox input, this is the text displayed next to the input.
   */
  placeholder: PropTypes.string,
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
  /**
   * Text string for button or checkbox
   */
  text: PropTypes.string,
  /**
   * Icon name for button icon
   */
  iconName: PropTypes.string,
};

FormField.defaultProps = {
  onClick: () => {},
  onChange: () => {},
  color: 'light',
  labelLine: true,
  inputType: 'text',
  placeholder: '',
  text: '',
  iconName: '',
};

export default FormField;
