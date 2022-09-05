import styled from "styled-components/native";

import { Button } from "../../atoms";

import type { ThemeType } from "../../../theme/themeHelpers";

export const Container = styled.ScrollView`
  flex: 1;
`;

export const InfoContainer = styled.View`
  margin-top: 16px;
  margin-left: 24px;
  margin-right: 24px;
`;

export const CategoryContainer = styled.View`
  margin-bottom: 16px;
`;

export const CategoryTitle = styled.Text`
  font-weight: bold;
  text-align: center;
`;

export const CategoryErrorText = styled.Text<{ theme: ThemeType }>`
  color: ${({ theme }) => theme.colors.primary.red[1]};
`;

export const CategoryEntry = styled.View`
  flex-direction: row;
  margin-top: 2px;
  margin-bottom: 2px;
`;

export const CategoryEntryName = styled.Text`
  flex-basis: 40%;
  text-align: right;
  padding-right: 8px;
`;

export const CategoryEntryValue = styled.Text`
  flex-basis: 60%;
`;

export const MarginButton = styled(Button)`
  margin-top: 8px;
  margin-bottom: 8px;
`;
