import React from "react";
import { View, LayoutAnimation } from "react-native";
import DynamicCardRenderer from "../DynamicCardRenderer/DynamicCardRenderer";
import { Input, Label, Select, Text } from "../../components/atoms";
import {
  CheckboxField,
  EditableList,
  GroupListWithAvatar,
  CalendarPicker,
  NavigationButtonField,
  NavigationButtonGroup,
  RepeaterField,
  RadioGroup,
} from "../../components/molecules";
import { getValidColorSchema, PrimaryColor } from "../../styles/themeHelpers";
import SummaryList from "../../components/organisms/SummaryList/SummaryList";
import ImageUploader from "../../components/molecules/ImageUploader/ImageUploader";
import ImageViewer from "../../components/molecules/ImageViewer/ImageViewer";
import PdfUploader from "../../components/molecules/PdfUploader/PdfUploader";
import PdfViewer from "../../components/molecules/PdfViewer/PdfViewer";
import BulletList from "../../components/organisms/BulletList";

import getUnApprovedCompletionsDescriptions from "../../helpers/FormatCompletions";
import { FormInputType, InputFieldType } from "../../types/FormTypes";
import { Answer, RequestedCompletions } from "../../types/Case";

/**
 * Explanation of the properties in this data structure:
 *
 * component: which React component to render.
 * changeEvent: the name of the event that the component should update the form value on. For example 'onChangeText' for a field input, or 'onChange' for a checkbox etc.
 * blurEvent: if the component can be blurred, this is the name of the corresponding prop, typically 'onBlur'
 * helpInComponent: set to true if the component has a help button 'inside', where the help should go instead of in the label.
 * helpProp: the name of the prop where the help object should be sent, typically just 'help'.
 * onMountEvent: The event that triggers when the input is mounted
 * props: additional props to send into the generated component
 */
interface InputTypeProperties {
  component: React.FunctionComponent<any>;
  changeEvent?: string;
  blurEvent?: string;
  focusEvent?: string;
  onMountEvent?: string;
  initialValue?: undefined | boolean | [] | Record<string, unknown>;
  helpInComponent?: boolean;
  helpProp?: string;
  addAnswerEvent?: string;
  props?: Record<string, unknown>;
}
type inputKeyType = FormInputType | InputFieldType;

const inputTypes: Record<inputKeyType, InputTypeProperties> = {
  text: {
    component: Input,
    changeEvent: "onChangeText",
    blurEvent: "onBlur",
    focusEvent: "onFocus",
    props: {
      showErrorMessage: true,
    },
  },
  number: {
    component: Input,
    blurEvent: "onBlur",
    changeEvent: "onChangeText",
    focusEvent: "onFocus",
    props: {
      showErrorMessage: true,
      keyboardType: "numeric",
    },
  },
  hidden: {
    component: Input,
    blurEvent: "onBlur",
    props: {
      showErrorMessage: false,
      hidden: true,
    },
    onMountEvent: "onMount",
  },
  date: {
    component: CalendarPicker,
    changeEvent: "onSelect",
    focusEvent: "onFocus",
    initialValue: undefined,
    props: {
      showErrorMessage: true,
    },
  },
  list: {},
  checkbox: {
    component: CheckboxField,
    changeEvent: "onChange",
    focusEvent: "onFocus",
    blurEvent: "onBlur",
    helpInComponent: true,
    helpProp: "help",
    props: {},
    initialValue: false,
  },
  editableList: {
    component: EditableList,
    changeEvent: "onInputChange",
    focusEvent: "onFocus",
    blurEvent: "onBlur",
    helpInComponent: true,
    helpProp: "help",
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
    changeEvent: "onValueChange",
    focusEvent: "onFocus",
    blurEvent: "onBlur",
    props: {},
  },
  radioGroup: {
    component: RadioGroup,
    changeEvent: "onSelect",
    props: {},
  },
  avatarList: {
    component: GroupListWithAvatar,
    changeEvent: "onChange",
    props: {},
    initialValue: [],
  },
  summaryList: {
    component: SummaryList,
    changeEvent: "onChange",
    focusEvent: "onFocus",
    blurEvent: "onBlur",
    helpInComponent: true,
    helpProp: "help",
    props: { answers: true, validation: true },
  },
  repeaterField: {
    component: RepeaterField,
    focusEvent: "onFocus",
    blurEvent: "onBlur",
    changeEvent: "onChange",
    addAnswerEvent: "onAddAnswer",
    props: {},
  },
  card: {
    component: DynamicCardRenderer,
  },
  imageUploader: {
    component: ImageUploader,
    changeEvent: "onChange",
    props: { answers: true },
  },
  imageViewer: {
    component: ImageViewer,
    changeEvent: "onChange",
    props: { answers: true },
  },
  pdfUploader: {
    component: PdfUploader,
    changeEvent: "onChange",
    props: { answers: true },
  },
  pdfViewer: {
    component: PdfViewer,
    changeEvent: "onChange",
    props: { answers: true },
  },
  bulletList: {
    component: BulletList,
  },
};

interface FormFieldProps {
  label: string;
  labelLine?: boolean;
  id: string;
  inputType?: FormInputType | InputFieldType;
  value:
    | undefined
    | number
    | string
    | Record<string, unknown>
    | Record<string, unknown>[];
  answers: Answer;
  validationErrors: Record<string, { isValid: boolean; message: string }>;
  colorSchema: PrimaryColor;
  help: {
    text: string;
    size: number;
    heading: string;
    tagline: string;
    url: string;
  };
  completions: RequestedCompletions[];
  inputSelectValue: InputFieldType;
  onAddAnswer: (answer: unknown, fieldId: string) => void;
  onClick: () => void;
  onMount: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onChange?: () => void;
}

const FormField = (props: FormFieldProps): JSX.Element => {
  const {
    label,
    labelLine = true,
    inputType = "text",
    colorSchema,
    id,
    onChange = () => true,
    onBlur,
    onFocus,
    onMount,
    onAddAnswer,
    value,
    answers,
    validationErrors,
    help,
    inputSelectValue,
    completions,
    ...other
  } = props;

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

  const onInputMount = (value, fieldId = id) => {
    if (onMount) onMount({ [fieldId]: value }, fieldId);
  };

  const onInputFocus = (e, isSelect = false) => {
    if (onFocus) {
      onFocus(e, isSelect);
    }
  };

  const onInputAddAnswer = (values, fieldId = id) => {
    const answerValues = { [fieldId]: values };
    if (onAddAnswer) onAddAnswer(answerValues, fieldId);
  };

  const inputProps = input && input.props ? input.props : {};
  const initialValue =
    value === "" && Object.prototype.hasOwnProperty.call(input, "initialValue")
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
  if (input?.props?.validation)
    inputCompProps.validationErrors = validationErrors;
  if (input && input.changeEvent) inputCompProps[input.changeEvent] = saveInput;
  if (input && input.blurEvent) inputCompProps[input.blurEvent] = onInputBlur;
  if (input && input.focusEvent)
    inputCompProps[input.focusEvent] = onInputFocus;
  if (input && input.helpInComponent)
    inputCompProps[input.helpProp || "help"] = help;
  if (input && input.onMountEvent)
    inputCompProps[input.onMountEvent] = onInputMount;

  if (inputType === "repeaterField" && !!input?.addAnswerEvent)
    inputCompProps[input.addAnswerEvent] = onInputAddAnswer;

  if (inputType === "bulletList") {
    inputCompProps.values = answers.includes("#COMPLETIONS_LIST")
      ? getUnApprovedCompletionsDescriptions(completions)
      : answers;
  }

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
          help={
            !input.helpInComponent && help && Object.keys(help).length > 0
              ? help
              : {}
          }
        >
          {label}
        </Label>
      ) : null}
      {inputComponent}
    </View>
  );
};

export default FormField;
