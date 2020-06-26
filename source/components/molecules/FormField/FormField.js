import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Input, FieldLabel, Checkbox, Text } from 'source/components/atoms';
import { EditableList } from 'source/components/molecules';
import { View } from 'react-native';
import colors from '../../../styles/colors';

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
    component: Checkbox,
  },
};

const FormField = props => {
  const { label, labelLine, inputType, color, placeholder, id, onChange } = props;
  const input = inputTypes[inputType];
  const saveInput = value => {
    onChange({ id: value });
  };

  const inputCompProps = { placeholder, color, ...input.props };
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
   * Placeholder, for certain input types (text, number, date)
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
   * sets the color theme.
   */
  color: PropTypes.oneOf(Object.keys(colors.formField)),
};

FormField.defaultProps = {
  onChange: () => {},
  color: 'light',
  labelLine: true,
  inputType: 'text',
  placeholder: '',
};

export default FormField;
