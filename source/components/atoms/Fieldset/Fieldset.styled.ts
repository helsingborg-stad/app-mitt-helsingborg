import styled from "styled-components/native";

import Text from "../Text/Text";

import type { ThemeType, PrimaryColor } from "../../../theme/themeHelpers";

interface FieldsetContainerProps {
  colorSchema: PrimaryColor;
  empty?: boolean;
  theme: ThemeType;
}

const FieldsetContainer = styled.View<FieldsetContainerProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  border-radius: 9.5px;
  overflow: hidden;
  margin: 16px 0px 24px 0px;
  padding: 16px;
  background: ${(props) =>
    props?.empty
      ? props.theme.fieldset[props.colorSchema].backgroundEmpty
      : props.theme.fieldset[props.colorSchema].background};
`;

const FieldsetHeader = styled.View`
  padding-left: 4px;
  position: relative;
  flex-direction: row;
`;

interface FieldsetHeaderSectionProps {
  justifyContent: string;
}

const FieldsetHeaderSection = styled.View<FieldsetHeaderSectionProps>`
  flex: 1;
  flex-direction: row;
  justify-content: ${(props) => props.justifyContent};
  align-items: center;
`;

const FieldsetBody = styled.View``;

interface FieldsetLegendProps {
  colorSchema: string;
}

const FieldsetLegend = styled(Text)<FieldsetLegendProps>`
  color: ${(props) => props.theme.fieldset[props.colorSchema].legend};
  font-size: 12px;
  padding: 8px 0px 12px 0px;
  font-weight: bold;
`;

interface FieldsetLegendBorderProps {
  colorSchema: PrimaryColor;
  theme: ThemeType;
}
const FieldsetLegendBorder = styled.View<FieldsetLegendBorderProps>`
  border-bottom-color: ${(props) =>
    props.theme.fieldset[props.colorSchema].legendBorder};
  border-bottom-width: 2px;
  align-self: flex-start;
`;

export {
  FieldsetContainer,
  FieldsetHeader,
  FieldsetHeaderSection,
  FieldsetBody,
  FieldsetLegend,
  FieldsetLegendBorder,
};
