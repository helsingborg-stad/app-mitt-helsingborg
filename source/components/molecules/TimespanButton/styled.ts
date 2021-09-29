import styled from "styled-components/native";

interface ButtonProps {
  selected: boolean;
  theme: any;
}
const ButtonContainer = styled.TouchableHighlight<ButtonProps>`
  padding: 12px 20px;
  margin: 0;
  width: ${({ selected }) => (selected ? "172px" : "150px")};
  height: 48px;
  background: ${({ theme, selected }) =>
    selected ? theme.colors.primary.red[1] : theme.colors.neutrals[5]};
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  justify-content: ${({ selected }) => (selected ? "space-between" : "center")};
  align-items: center;
`;

interface TimeTextProps {
  selected: boolean;
}
const TimeText = styled.Text<TimeTextProps>`
  color: ${({ selected }) => (selected ? "white" : "black")};
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  padding: 0;
  margin: 0;
`;

export { ButtonContainer, TimeText };
