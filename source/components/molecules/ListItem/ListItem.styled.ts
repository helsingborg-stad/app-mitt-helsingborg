import styled from "styled-components/native";

import Button from "../../atoms/Button/Button";
import Text from "../../atoms/Text";
import Icon from "../../atoms/Icon";

import type { ThemeType } from "../../../theme/themeHelpers";

const HighlightedItem = styled(Button)`
  padding: 0px;
  margin-bottom: 12px;
  background-color: white;
`;

const Flex = styled.View`
  flex-direction: row;
  align-items: center;
`;

interface TitleProps {
  theme: ThemeType;
}
const Title = styled(Text)<TitleProps>`
  color: ${(props) => props.theme.background.darkest};
  margin-bottom: 4px;
`;

const Content = styled.View`
  flex: 1;
  padding: 16px 0px 16px 8px;
`;

const Chevron = styled(Icon)`
  color: #a3a3a3;
  margin-right: 16px;
`;

export { Chevron, Content, Title, Flex, HighlightedItem };
