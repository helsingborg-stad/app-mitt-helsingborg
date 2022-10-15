import styled from "styled-components/native";

import type { ThemeType } from "../../../theme/themeHelpers";

const SegmentWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
`;

const StartSegment = styled.View<{ selected?: boolean; theme: ThemeType }>`
  height: 3px;
  width: 12px;
  margin-right: 3px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.neutrals[2] : theme.colors.neutrals[4]};
`;

const EndSegment = styled.View<{ selected?: boolean; theme: ThemeType }>`
  height: 3px;
  width: 12px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.neutrals[2] : theme.colors.neutrals[4]};
`;

const MiddleSegment = styled.View<{ selected?: boolean; theme: ThemeType }>`
  height: 3px;
  width: 12px;
  margin-right: 3px;
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.neutrals[2] : theme.colors.neutrals[4]};
`;

export { SegmentWrapper, StartSegment, EndSegment, MiddleSegment };
