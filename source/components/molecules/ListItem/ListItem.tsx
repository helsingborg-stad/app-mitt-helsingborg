import React from "react";
import Text from "../../atoms/Text";

import {
  Chevron,
  Content,
  Title,
  Flex,
  HighlightedItem,
} from "./ListItem.styled";

import type { Props } from "./ListItem.types";

const ListItem = ({ title, text, onClick }: Props): JSX.Element => (
  <HighlightedItem onClick={onClick} block>
    <Flex>
      <Content>
        {title && title.trim() !== "" ? <Title small>{title}</Title> : null}
        {text && text.trim() !== "" ? <Text>{text}</Text> : null}
      </Content>
      <Chevron name="chevron-right" />
    </Flex>
  </HighlightedItem>
);

export default ListItem;
