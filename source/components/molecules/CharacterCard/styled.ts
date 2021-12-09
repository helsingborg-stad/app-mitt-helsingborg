import styled from "styled-components/native";

import Text from "../../atoms/Text";
import Heading from "../../atoms/Heading";
import Button from "../../atoms/Button";

interface BodyProps {
  outlineColor: string;
  cardColor: string;
}
const Card = styled.TouchableHighlight<BodyProps>`
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
  margin-bottom: 10px;
  margin-left: 5px;
  margin-right: 5px;
`;

interface SectionProps {
  flexDirection?: "column" | "row";
  justify?: "flex-start" | "flex-end";
  flex?: number;
  marginLeft?: boolean;
}
const Section = styled.View<SectionProps>`
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
  width: 100%;
`;

interface CardSubTitleProps {
  colorSchema?: string;
}
const CardSubtitle = styled(Text)<CardSubTitleProps>`
  width: 100%;
  color: ${({ theme, colorSchema = "neutral" }) =>
    theme.colors.primary[colorSchema][1]};
  font-size: ${({ theme }) => theme.fontSizes[2]}px;
  font-weight: ${({ theme }) => theme.fontWeights[1]};
  margin: 0;
  padding: 0;
  line-height: 16px;
`;

const DetailButton = styled(Button)`
  margin-top: 12px;
`;

export { Card, Section, Image, CardTitle, CardSubtitle, DetailButton };
