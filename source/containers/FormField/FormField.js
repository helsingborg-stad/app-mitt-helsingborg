import React from 'react';
import PropTypes from 'prop-types';
import { View, LayoutAnimation } from 'react-native';
import DynamicCardRenderer from '../DynamicCardRenderer/DynamicCardRenderer';
import { Input, Label, Select, Text } from '../../components/atoms';
import {
  CheckboxField,
  EditableList,
  GroupListWithAvatar,
  CalendarPicker,
  NavigationButtonField,
  NavigationButtonGroup,
  RepeaterField,
  RadioGroup,
} from '../../components/molecules';
import theme from '../../styles/theme';
import { getValidColorSchema } from '../../styles/themeHelpers';
import SummaryList from '../../components/organisms/SummaryList/SummaryList';
import ImageUploader from '../../components/molecules/ImageUploader/ImageUploader';
import ImageViewer from '../../components/molecules/ImageViewer/ImageViewer';
import PdfUploader from '../../components/molecules/PdfUploader/PdfUploader';
import PdfViewer from '../../components/molecules/PdfViewer/PdfViewer';
/**
 * Explanation of the properties in this data structure:
 *
 * component: which React component to render.
 * changeEvent: the name of the event that the component should update the form value on. For example 'onChangeText' for a field input, or 'onChange' for a checkbox etc.
 * blurEvent: if the component can be blurred, this is the name of the corresponding prop, typically 'onBlur'
 * helpInComponent: set to true if the component has a help button 'inside', where the help should go instead of in the label.
 * helpProp: the name of the prop where the help object should be sent, typically just 'help'.
 * props: additional props to send into the generated component
 */
const inputTypes = {
  text: {
    component: Input,
    changeEvent: 'onChangeText',
    blurEvent: 'onBlur',
    props: {
      showErrorMessage: true,
    },
  },
  number: {
    component: Input,
    blurEvent: 'onBlur',
    changeEvent: 'onChangeText',
    props: {
      showErrorMessage: true,
      keyboardType: 'numeric',
    },
  },
  hidden: {
    component: Input,
    blurEvent: 'onBlur',
    props: {
      showErrorMessage: false,
      hidden: true,
    },
  },
  date: {
    component: CalendarPicker,
    changeEvent: 'onSelect',
    initialValue: undefined,
    props: {
      showErrorMessage: true,
    },
  },
  list: {},
  checkbox: {
    component: CheckboxField,
    changeEvent: 'onChange',
    blurEvent: 'onBlur',
    helpInComponent: true,
    helpProp: 'help',
    props: {},
    initialValue: false,
  },
  editableList: {
    component: EditableList,
    changeEvent: 'onInputChange',
    blurEvent: 'onBlur',
    helpInComponent: true,
    helpProp: 'help',
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
    blurEvent: 'onBlur',
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
    helpInComponent: true,
    helpProp: 'help',
    props: { answers: true, validation: true },
  },
  repeaterField: {
    component: RepeaterField,
    blurEvent: 'onBlur',
    changeEvent: 'onChange',
    props: {},
  },
  card: {
    component: DynamicCardRenderer,
  },
  imageUploader: {
    component: ImageUploader,
    changeEvent: 'onChange',
    props: { answers: true },
  },
  imageViewer: {
    component: ImageViewer,
    changeEvent: 'onChange',
    props: { answers: true },
  },
  pdfUploader: {
    component: PdfUploader,
    changeEvent: 'onChange',
    props: { answers: true },
  },
  pdfViewer: {
    component: PdfViewer,
    changeEvent: 'onChange',
    props: { answers: true },
  },
};

const FormField = ({
  label,
  labelLine,
  inputType,
  colorSchema,
  id,
  onChange,
  onBlur,
  value,
  answers,
  validationErrors,
  help,
  inputSelectValue,
  ...other
}) => {
  const validColorSchema = getValidColorSchema(colorSchema);
  const input = inputTypes[inputType];
  if (input === undefined) {
    return <Text>{`Invalid field type: ${inputType}`}</Text>;
  }
  const saveInput = (value, fieldId = id) => {
    if (onChange) onChange({ [fieldId]: value }, fieldId);
  };
  const onInputBlur = (value, fieldId = id) => {
    if (onBlur) onBlur({ [fieldId]: value }, fieldId);
  };

  const inputProps = input && input.props ? input.props : {};
  const initialValue =
    value === '' && Object.prototype.hasOwnProperty.call(input, 'initialValue')
      ? input.initialValue
      : value;
  const inputCompProps = {
    colorSchema: validColorSchema,
    value: initialValue,
    ...inputProps,
    error: validationErrors[id],
    inputType: inputSelectValue, // rename this so that we get a better name in the app
    id,
    ...other,
  };
  if (input?.props?.answers) inputCompProps.answers = answers;
  if (input?.props?.validation) inputCompProps.validationErrors = validationErrors;
  if (input && input.changeEvent) inputCompProps[input.changeEvent] = saveInput;
  if (input && input.blurEvent) inputCompProps[input.blurEvent] = onInputBlur;
  if (input && input.helpInComponent) inputCompProps[input.helpProp || 'help'] = help;

  const inputComponent =
    input && input.component ? (
      React.createElement(input.component, inputCompProps)
    ) : (
      <Text>{`Invalid field type: ${inputType}`}</Text>
    );

  LayoutAnimation.configureNext({
    duration: 300,
    create: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
  });

  return (
    <View>
      {label ? (
        <Label
          colorSchema={validColorSchema}
          underline={labelLine}
          help={!input.helpInComponent && help && Object.keys(help).length > 0 ? help : {}}
        >
          {label}
        </Label>
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
  /** What happens when an input field looses focus.  */
  onBlur: PropTypes.func,
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
  colorSchema: PropTypes.oneOf([...Object.keys(theme.colors.primary), '']),
  /*
   * The function triggers when the button is clicked.
   */
  onClick: PropTypes.func,
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
  inputSelectValue: PropTypes.oneOf([
    'text',
    'number',
    'hidden',
    'date',
    'email',
    'postalCode',
    'personalNumber',
    'phone',
    'card',
    'editableList',
    'checkbox',
    'navigationButtonGroup',
    'summaryList',
    'repeaterField',
    'imageUploader',
    'imageViewer',
    'pdfUploader',
    'pdfViewer',
  ]),
};

FormField.defaultProps = {
  onClick: () => {},
  onChange: () => {},
  labelLine: true,
  inputType: 'text',
};

export default FormField;
