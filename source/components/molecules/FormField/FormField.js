import React from 'react';
import PropTypes from 'prop-types';
import { View, LayoutAnimation } from 'react-native';
import { Input, Label, Select, Text } from 'source/components/atoms';
import { CheckboxField, EditableList, GroupListWithAvatar } from 'source/components/molecules';
import DateTimePickerForm from '../DateTimePicker/DateTimePickerForm';
import NavigationButtonField from '../NavigationButtonField/NavigationButtonField';
import NavigationButtonGroup from '../NavigationButtonGroup/NavigationButtonGroup';
import SummaryList from '../../organisms/SummaryList/SummaryList';
import RepeaterField from '../RepeaterField/RepeaterField';
import theme from '../../../styles/theme';
import RadioGroup from '../RadioGroup/RadioGroup';

const inputTypes = {
  text: {
    component: Input,
    changeEvent: 'onChangeText',
    blurEvent: 'onBlur',
  },
  number: {
    component: Input,
    blurEvent: 'onBlur',
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
    blurEvent: 'onBlur',
    props: {},
    initialValue: {},
  },
  navigationButton: {
    component: NavigationButtonField,
    props: {},
  },
  navigationButtonGroup: {
    component: NavigationButtonGroup,
    props: {},
  },
  select: {
    component: Select,
    changeEvent: 'onValueChange',
    props: {},
  },
  radioGroup: {
    component: RadioGroup,
    changeEvent: 'onSelect',
    props: {},
  },
  avatarList: {
    component: GroupListWithAvatar,
    changeEvent: 'onChange',
    props: {},
    initialValue: [],
  },
  summaryList: {
    component: SummaryList,
    changeEvent: 'onChange',
    blurEvent: 'onBlur',
    props: { answers: true, validation: true },
  },
  repeaterField: {
    component: RepeaterField,
    blurEvent: 'onBlur',
    changeEvent: 'onChange',
    props: {},
  },
};

const FormField = ({
  label,
  labelLine,
  inputType,
  color,
  id,
  onChange,
  handleBlur,
  value,
  answers,
  validationErrors,
  conditionalOn,
  labelHelp,
  ...other
}) => {
  const input = inputTypes[inputType];
  if (!input) {
    return <Text>{`Invalid field type: ${inputType}`}</Text>;
  }
  const saveInput = (value, fieldId = id) => {
    if (onChange) onChange({ [fieldId]: value }, fieldId);
  };
  const onBlur = (value, fieldId = id) => {
    if (handleBlur) handleBlur({ [fieldId]: value }, fieldId);
  };
  if (!input) {
    return <Text>{`Invalid field type: ${inputType}`}</Text>;
  }
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
    error: validationErrors[id],
    ...other,
  };
  if (input?.props?.answers) inputCompProps.answers = answers;
  if (input?.props?.validation) inputCompProps.validationErrors = validationErrors;
  if (input && input.changeEvent) inputCompProps[input.changeEvent] = saveInput;
  if (input && input.blurEvent) inputCompProps[input.blurEvent] = onBlur;

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
      <Text>{`Invalid field type: ${inputType}`}</Text>
    );

  if (checkCondition(conditionalOn)) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    return (
      <View>
        {label ? (
          <Label
            color={color}
            underline={labelLine}
            help={labelHelp ? { heading: label, text: labelHelp } : {}}
          >
            {label}
          </Label>
        ) : null}
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
  /** What happens when an input field looses focus.  */
  handleBlur: PropTypes.func,
  /**
   * sets the value, since the input field component should be managed.
   */
  value: PropTypes.any,
  /**
   * All the form state answers. Needed because of conditional checks.
   */
  answers: PropTypes.object,
  validationErrors: PropTypes.object,
  formNavigation: PropTypes.shape({
    next: PropTypes.func,
    back: PropTypes.func,
    up: PropTypes.func,
    down: PropTypes.func,
    close: PropTypes.func,
    start: PropTypes.func,
    isLastStep: PropTypes.func,
  }),
  /**
   * sets the color theme.
   */
  color: PropTypes.oneOf(Object.keys(theme.formField)),
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
