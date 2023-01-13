import { Platform, LayoutAnimation } from "react-native";
import styled from "styled-components/native";

import { Button, Input, Select, Text } from "../../atoms";

import type { ThemeType, PrimaryColor } from "../../../theme/themeHelpers";
import type { ValidationObject } from "../../../types/Validation";

const EditableListBody = styled.View`
  padding-top: 33px;
  height: auto;
`;

interface EditableListItemProps {
  theme: ThemeType;
  editable: boolean;
  error?: ValidationObject;
  colorSchema: PrimaryColor;
}
const EditableListItem = styled.TouchableOpacity<EditableListItemProps>`
  font-size: ${({ theme }) => theme.fontSizes[4]}px;
  flex-direction: row;
  height: auto;
  background-color: transparent;
  border-radius: 4.5px;
  margin-bottom: 14px;
  ${({ theme, error }) =>
    !(error?.isValid || !error) &&
    `border: solid 1px ${theme.colors.primary.red[0]}`}
  ${({ theme, editable, colorSchema }) =>
    editable &&
    `background-color: ${theme.colors.complementary[colorSchema][2]};`};
  ${({ editable }) => editable && Platform.OS === "ios" && `padding: 16px;`};
`;

interface EditableListItemLabelWrapperProps {
  alignAtStart: boolean;
}
const EditableListItemLabelWrapper = styled.View<EditableListItemLabelWrapperProps>`
  flex: 4;
  justify-content: ${(props) => (props.alignAtStart ? "flex-start" : "center")};
`;

interface EditableListItemLabelProps {
  theme: ThemeType;
  editable: boolean;
}
const EditableListItemLabel = styled.Text<EditableListItemLabelProps>`
  font-weight: ${({ theme }) => theme.fontWeights[1]};
  color: ${({ theme }) => theme.colors.neutrals[1]};
  ${({ editable }) =>
    editable &&
    Platform.OS === "android" &&
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

const EditableListItemInput = styled(Input)`
  text-align: right;
  min-width: 80%;
  font-weight: 500;
  padding: 0px;
  color: ${(props) => props.theme.colors.neutrals[1]};
  ${(props) =>
    props.editable &&
    Platform.OS === "android" &&
    `
    margin: 16px;
    margin-left: 0;
      `};
`;

const EditableListItemSelect = styled(Select)`
  min-width: 80%;
  font-weight: 500;
  margin-bottom: 0px;
  ${({ editable }) =>
    editable &&
    Platform.OS === "android" &&
    `
    margin: 16px;
    margin-left: 0;
  `};
`;

const FieldsetButton = styled(Button)`
  margin-left: 26px;
`;

const StyledErrorText = styled(Text)`
  padding-bottom: 20px;
  color: ${(props) => props.theme.textInput.errorTextColor};
`;

function configureNextLayoutAnimation(): void {
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
}

export {
  EditableListBody,
  EditableListItem,
  EditableListItemLabelWrapper,
  EditableListItemLabel,
  EditableListItemInputWrapper,
  EditableListItemInput,
  EditableListItemSelect,
  FieldsetButton,
  StyledErrorText,
  configureNextLayoutAnimation,
};
