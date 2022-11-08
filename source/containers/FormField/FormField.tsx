import React from "react";
import { LayoutAnimation, View } from "react-native";
import CheckboxList from "../../components/organisms/CheckboxList";
import DynamicCardRenderer from "../DynamicCardRenderer/DynamicCardRenderer";
import { Input, Label, Select, Text } from "../../components/atoms";
import {
  CheckboxField,
  EditableList,
  CalendarPicker,
  NavigationButtonField,
  NavigationButtonGroup,
  RepeaterField,
  RadioGroup,
} from "../../components/molecules";
import type { PrimaryColor } from "../../theme/themeHelpers";
import { getValidColorSchema } from "../../theme/themeHelpers";
import SummaryList from "../../components/organisms/SummaryList/SummaryList";
import FileUploaderList from "../../components/molecules/FileUploaderList/FileUploaderList";
import BulletList from "../../components/organisms/BulletList";
import FilePicker from "../../components/molecules/FilePicker/FilePicker";
import FileViewer from "../../components/molecules/FileViewer/FileViewer";

import { FormFieldContainer, LabelContainer } from "./FormField.styled";

import getUnApprovedCompletionsDescriptions from "../../helpers/FormatCompletions";
import type { FormInputType, InputFieldType } from "../../types/FormTypes";
import type { Answer, VIVACaseDetails } from "../../types/Case";

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
  component: React.FunctionComponent<P>;
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

interface FormFieldProps {
  label: string;
  labelLine?: boolean;
  id: string;
  inputType?: InputKeyType;
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
  details: VIVACaseDetails;
  inputSelectValue: InputFieldType;
  initialValues: string[];
  onAddAnswer: (answer: unknown, fieldId: string) => void;
  onClick: () => void;
  onMount: () => void;
  onBlur: () => void;
  onChange?: () => void;
}

type InputKeyType = FormInputType | InputFieldType;

const inputTypes: Record<InputKeyType, InputTypeProperties> = {
  text: {
    component: Input,
    changeEvent: "onChangeText",
    blurEvent: "onBlur",
    props: {
      showErrorMessage: true,
    },
  },
  number: {
    component: Input,
    blurEvent: "onBlur",
    changeEvent: "onChangeText",
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
    initialValue: undefined,
    props: {
      showErrorMessage: true,
    },
  },
  list: {},
  checkbox: {
    component: CheckboxField,
    changeEvent: "onChange",
    blurEvent: "onBlur",
    helpInComponent: true,
    helpProp: "help",
    props: {},
    initialValue: false,
  },
  editableList: {
    component: EditableList,
    changeEvent: "onInputChange",
    blurEvent: "onBlur",
    helpInComponent: true,
    helpProp: "help",
    props: {},
    initialValue: {},
  },
  fileUploaderList: {
    component: FileUploaderList,
    changeEvent: "onChange",
    props: { answers: true },
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
    blurEvent: "onBlur",
    props: {},
  },
  radioGroup: {
    component: RadioGroup,
    changeEvent: "onSelect",
    props: {},
  },
  summaryList: {
    component: SummaryList,
    changeEvent: "onChange",
    blurEvent: "onBlur",
    helpInComponent: true,
    helpProp: "help",
    props: { answers: true, validation: true },
  },
  repeaterField: {
    component: RepeaterField,
    blurEvent: "onBlur",
    changeEvent: "onChange",
    addAnswerEvent: "onAddAnswer",
    props: {},
  },
  card: {
    component: DynamicCardRenderer,
  },
  filePicker: {
    component: FilePicker,
    changeEvent: "onChange",
    props: { answers: true },
  },
  bulletList: {
    component: BulletList,
  },
  checkboxList: {
    component: CheckboxList,
    changeEvent: "onChange",
  },
  fileViewer: {
    component: FileViewer,
    changeEvent: "onChange",
    props: { answers: true },
  },
};

const FormField = (props: FormFieldProps): JSX.Element => {
  const {
    label,
    labelLine = true,
    inputType = "text",
    colorSchema,
    id,
    onChange = () => true,
    onBlur,
    onMount,
    onAddAnswer,
    value,
    answers,
    validationErrors,
    help,
    inputSelectValue,
    details,
    initialValues,
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
    label,
    ...other,
  };

  if (input?.props?.answers) inputCompProps.answers = answers;
  if (input?.props?.validation)
    inputCompProps.validationErrors = validationErrors;
  if (input && input.changeEvent) inputCompProps[input.changeEvent] = saveInput;
  if (input && input.blurEvent) inputCompProps[input.blurEvent] = onInputBlur;
  if (input && input.helpInComponent)
    inputCompProps[input.helpProp || "help"] = help;
  if (input && input.onMountEvent)
    inputCompProps[input.onMountEvent] = onInputMount;

  if (inputType === "repeaterField" && !!input?.addAnswerEvent)
    inputCompProps[input.addAnswerEvent] = onInputAddAnswer;

  if (inputType === "filePicker") {
    inputCompProps.preferredFileName = label;
  }

  if (inputType === "bulletList" || inputType === "fileUploaderList") {
    inputCompProps.values = initialValues;

    if (initialValues?.includes("#COMPLETIONS_LIST")) {
      inputCompProps.values = getUnApprovedCompletionsDescriptions(
        details?.completions?.requested ?? []
      );
    }
    if (initialValues?.includes("#completionsUploaded")) {
      inputCompProps.values = details?.completions?.attachmentUploaded ?? [];
    }
  }

  inputCompProps.completionsClarification =
    details.completions?.description ?? "";

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

  const requiredSymbol = props?.validation?.isRequired ? " *" : "";

  return (
    <FormFieldContainer>
      <LabelContainer>
        {!!label && (
          <Label
            colorSchema={validColorSchema}
            underline={labelLine}
            help={
              !input.helpInComponent && help && Object.keys(help).length > 0
                ? help
                : {}
            }
          >
            {`${label}${requiredSymbol}`}
          </Label>
        )}
      </LabelContainer>
      <View style={{ flex: 1 }}>{inputComponent}</View>
    </FormFieldContainer>
  );
};

export default FormField;
