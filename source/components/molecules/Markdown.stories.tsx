import { storiesOf } from "@storybook/react-native";
import React from "react";
import { View } from "react-native";

import MarkdownConstructor from "../../helpers/MarkdownConstructor";

import StoryWrapper from "./StoryWrapper";
import { Text } from "../atoms";

const rules = {
  text: (node, _children, _parent, _styles) => (
    <Text style={{ fontSize: 16 }} key={node.key}>
      {node.content}
    </Text>
  ),
  bullet_list: (node, children, parent, styles) => (
    <View key={node.key} style={[styles.list, styles.listUnordered]}>
      {children}
    </View>
  ),
};

const styles = {
  heading: {
    borderBottomWidth: 1,
    borderColor: "#000000",
  },
  heading1: {
    fontSize: 32,
    backgroundColor: "#000000",
    color: "#FFFFFF",
  },
  heading2: {
    fontSize: 24,
  },
  heading3: {
    fontSize: 18,
  },
  heading4: {
    fontSize: 16,
  },
  heading6: {
    fontSize: 11,
  },
  listUnorderedItemIcon: {
    lineHeight: 25,
    marginLeft: 5,
    marginRight: 5,
    fontSize: 30,
  },
  listUnorderedItemText: {
    fontSize: 20,
  },
  paragraph: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
};

const list = `
Okej, då ska jag hjälpa dig med det. För att boka vigsel behöver jag veta:

- Vem du ska gifta dig med
- När ni vill gifta er
- Om er vigsel ska vara i Rådhuset i Helsingborg eller på egen vald plats
`;

const linebreak = `before
&nbsp;
&nbsp;
after`;

const mixed = `
# h1 Heading 8-)

**This is some bold text!**

This is normal text
`;

const url = `[Helsingborg.se](https://www.helsingborg.se)`;

storiesOf("Text", module).add("Markdown", () => (
  <StoryWrapper>
    <Text type="h3">Mixed</Text>
    <MarkdownConstructor style={styles} rules={rules} rawText={mixed} />

    <Text type="h3">Linebreak</Text>
    <MarkdownConstructor style={styles} rules={rules} rawText={linebreak} />

    <Text type="h3">List</Text>
    <MarkdownConstructor style={styles} rules={rules} rawText={list} />

    <Text type="h3">URL</Text>
    <MarkdownConstructor style={styles} rules={rules} rawText={url} />
  </StoryWrapper>
));
