import styled from "styled-components/native";
import { Input, Label, Select } from "../../atoms";
import type { PrimaryColor, ThemeType } from "../../../theme/themeHelpers";

interface DefaultProps {
  theme: ThemeType;
}

const Base = styled.View`
  padding: 0px 0px 30px 0px;
  margin-bottom: 5px;
  flex-direction: column;
  border-radius: 6px;
`;

const TopContainer = styled.View`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  padding: 4px;
`;

interface RepeaterItemProps extends DefaultProps {
  colorSchema: PrimaryColor;
  error: Record<string, unknown>;
  hidden?: boolean;
}

const RepeaterItem = styled.TouchableOpacity<RepeaterItemProps>`
  font-size: ${({ theme }) => theme.fontSizes[4]}px;
  flex-direction: row;
  height: auto;
  background-color: transparent;
  border-radius: 4.5px;
  margin-bottom: 10px;
  ${({ theme, error }) =>
    !(error?.isValid || !error) &&
    `border: solid 1px ${theme.colors.primary.red[0]}`};
  background-color: ${({ theme, colorSchema }) =>
    theme.repeater[colorSchema].inputBackground};
  padding: 10px;
  ${({ hidden }) => (hidden ? "display: none" : null)}

  justify-content: space-between;
  align-items: center;
`;

interface ItemLabelProps extends DefaultProps {
  colorSchema: PrimaryColor;
}
const ItemLabel = styled(Label)<ItemLabelProps>`
  font-size: 12px;
  color: ${({ theme, colorSchema }) => theme.repeater[colorSchema].inputText};
  padding: 8px 0 0 0;
`;

const InputLabelWrapper = styled.View`
  justify-content: center;
`;

interface InputLabelProps extends DefaultProps {
  colorSchema: PrimaryColor;
}
const InputLabel = styled.Text<InputLabelProps>`
  padding: 4px;
  font-weight: ${({ theme }) => theme.fontWeights[1]};
  color: ${({ theme, colorSchema }) => theme.repeater[colorSchema].inputText};
`;

interface InputWrapperProps extends DefaultProps {
  hidden?: boolean;
}
const InputWrapper = styled.View<InputWrapperProps>`
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  ${({ hidden }) => (hidden ? "display: none" : null)};
  flex-shrink: 1;
  padding-left: 10px;
`;

interface ItemInputProps extends DefaultProps {
  colorSchema: PrimaryColor;
}
const ItemInput = styled(Input)<ItemInputProps>`
  font-weight: 500;
  color: ${({ theme, colorSchema }) => theme.repeater[colorSchema].inputText};
  padding: 5px;
`;

interface SelectInputProps extends DefaultProps {
  colorSchema: PrimaryColor;
}
const SelectInput = styled(Select)<SelectInputProps>`
  text-align: right;
  min-width: 80%;
  font-weight: 500;
  color: ${({ theme, colorSchema }) => theme.repeater[colorSchema].inputText};
  padding: 5px;
  margin-bottom: 0px;
`;

interface DeleteButtonTextProps extends DefaultProps {
  colorSchema: PrimaryColor;
}
const DeleteButtonText = styled.Text<DeleteButtonTextProps>`
  text-transform: uppercase;
  font-size: 10px;
  color: ${({ theme, colorSchema }) =>
    theme.repeater[colorSchema].deleteButtonText};
  font-weight: 700;
`;

const DeleteButton = styled.TouchableOpacity`
  background-color: #eee;
  padding: 6px;
  border-radius: 5px;
  justify-content: center;
`;

export {
  Base,
  TopContainer,
  RepeaterItem,
  ItemLabel,
  InputLabelWrapper,
  InputLabel,
  InputWrapper,
  ItemInput,
  SelectInput,
  DeleteButtonText,
  DeleteButton,
};
