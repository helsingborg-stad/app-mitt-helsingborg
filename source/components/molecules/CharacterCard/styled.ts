import styled from "styled-components/native";

import Text from "../../atoms/Text";
import Heading from "../../atoms/Heading";

type BodyType = {
  outlineColor: string;
  cardColor: string;
};
const Card = styled.TouchableHighlight<BodyType>`
  display: flex;
  flex-direction: row;
  border-radius: 10px;
  elevation: 2;
  shadow-offset: 0px 2px;
  shadow-color: black;
  shadow-opacity: 0.3;
  shadow-radius: 2px;
  padding: 16px;
  border: ${({ outlineColor }) => `1px solid ${outlineColor}`};
  background: ${({ cardColor }) => cardColor};
`;

type SectionType = {
  flexDirection?: "column" | "row";
  justify?: "flex-start" | "flex-end";
  flex?: number;
  marginLeft?: boolean;
};
const Section = styled.View<SectionType>`
  min-height: 60px;
  display: flex;
  align-items: center;
  flex-direction: ${({ flexDirection }) => flexDirection || "row"};
  justify-content: ${({ justify }) => justify || "center"};
  flex: ${({ flex }) => flex || 1};
  margin-left: ${({ marginLeft }) => (marginLeft ? "24px" : "0px")};
`;

const Image = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 50px;
`;

const CardTitle = styled(Heading)`
  color: ${({ theme }) => theme.colors.neutrals[1]};
  width: 100%;
`;

type CardSubTitleType = {
  colorSchema?: string;
};
const CardSubtitle = styled(Text)<CardSubTitleType>`
  width: 100%;
  color: ${({ theme, colorSchema = "neutral" }) =>
    theme.colors.primary[colorSchema][1]};
  font-size: ${({ theme }) => theme.fontSizes[2]}px;
  font-weight: ${({ theme }) => theme.fontWeights[1]};
  margin: 0;
  padding: 0;
  line-height: 16px;
`;

export { Card, Section, Image, CardTitle, CardSubtitle };
