import styled from "styled-components/native";
import { Card } from "..";

Card.LargeText = styled(Card.Text)`
  font-size: ${(props) => props.theme.fontSizes[4]}px;
  font-weight: ${(props) => props.theme.fontWeights[1]};
  margin-bottom: 4px;
`;

Card.Meta = styled(Card.Text)`
  font-size: ${(props) => props.theme.fontSizes[3]}px;
  ${(props) => `color: ${props.theme.colors.neutrals[1]};`}
`;

Card.PinText = styled(Card.Text)`
  font-size: ${(props) => props.theme.fontSizes[9]}px;
  font-weight: ${(props) => props.theme.fontWeights[1]};
  line-height: ${(props) => props.theme.lineHeights[8]}px;
  margin-top: 12px;
`;

const CompletionsClarificationOutset = styled.View`
  padding-top: 8px;
  padding-bottom: 8px;
`;

export { Card, CompletionsClarificationOutset };
