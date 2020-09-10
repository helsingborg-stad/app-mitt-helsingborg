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
    initialValue: '',
  },
  list: {},
  checkbox: {
    component: CheckboxField,
    changeEvent: 'onChange',
    props: {},
    initialValue: false,
  },
  editableList: {
    component: EditableList,
    changeEvent: 'onInputChange',
    props: {},
    initialValue: {},
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
    initialValue: {},
  },
  substepListSummary: {
    component: SubstepList,
    changeEvent: 'onChange',
    props: { summary: true },
    initialValue: {},
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
    initialValue: [],
  },
  conditionalTextField: {
    component: ConditionalTextField,
    changeEvent: 'onChange',
    props: {},
    initialValue: '',
  },
};

const FormField = props => {
  const {
    label,
    labelLine,
    inputType,
    color,
    id,
    onChange,
    value,
    answers,
    conditionalOn,
    labelHelp,
    ...other
  } = props;
  const input = inputTypes[inputType];
  const saveInput = value => {
    if (onChange) onChange({ [id]: value });
  };
  const inputProps = input && input.props ? input.props : {};
  const initialValue =
    value === '' && Object.prototype.hasOwnProperty.call(input, 'initialValue')
      ? input.initialValue
      : value;
  const inputCompProps = {
    color,
    value: initialValue,
    help:
      other.inputHelp && other.text ? { text: other.inputHelp, heading: other.text } : undefined,
    ...inputProps,
    ...other,
  };
  if (input && input.changeEvent) inputCompProps[input.changeEvent] = saveInput;

  /** Checks if the field is conditional on another input, and if so,
   * evaluates whether this field should be active or not */
  const checkCondition = questionId => {
    if (!questionId) return true;

    if (typeof questionId === 'string') {
      if (questionId[0] === '!') {
        const qId = questionId.slice(1);
        return !answers[qId];
      }
      return answers[questionId];
    }
    return true;
  };

  const inputComponent =
    input && input.component ? (
      React.createElement(input.component, inputCompProps)
    ) : (
      <Text>{`Invalid field type ${inputType}`}</Text>
    );

  if (checkCondition(conditionalOn)) {
    return (
      <View>
        {label && (
          <FieldLabel
            color={color}
            underline={labelLine}
            help={labelHelp ? { heading: label, text: labelHelp } : {}}
          >
            {label}
          </FieldLabel>
        )}
        {inputComponent}
      </View>
    );
  }
  return null;
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
   * All the form state answers. Needed because of conditional checks.
   */
  answers: PropTypes.object,
  /**
   * sets the color theme.
   */
  color: PropTypes.oneOf(Object.keys(colors.formField)),
  /*
   * The function triggers when the button is clicked.
   */
  onClick: PropTypes.func,
  /**
   * The id of another input field: if supplied, the formField input will only be active (i.e. visible, for now)
   * if the answer to the other input value evaluates as 'truthy'.
   * One can also add an ! in front of the id to enable the field if the other input evaluates as 'falsy', i.e. !id.
   */
  conditionalOn: PropTypes.string,
  /**
   * Property to show a help button
   */
  labelHelp: PropTypes.string,
};

FormField.defaultProps = {
  onClick: () => {},
  onChange: () => {},
  color: 'light',
  labelLine: true,
  inputType: 'text',
};

export default FormField;
