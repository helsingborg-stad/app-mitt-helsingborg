import styled from "styled-components/native";
import Body from "../../molecules/Dialog/Body";
import { Text } from "../../atoms";
import { ThemeType } from "../../../styles/themeHelpers";

export const DialogContainer = styled(Body)`
  padding: 32px;
`;

export const ButtonContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 25px;
  width: 100%;
`;

export const ErrorText = styled(Text)`
  text-align: center;
  margin-top: 10px;
  color: ${({ theme }: { theme: ThemeType }) => {
    console.log("theme is ", theme);
    return theme.colors.primary.red[1];
  }};
`;
