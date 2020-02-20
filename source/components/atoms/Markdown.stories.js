/* eslint-disable no-shadow */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';
import Markdown, { getUniqueID } from 'react-native-markdown-display';
import StoryWrapper from '../molecules/StoryWrapper';
import Text from './Text';
import MarkdownConstructor from '../../helpers/MarkdownConstructor';

const rules = {
  text: (node, children, parent, styles) => (
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

const styles = StyleSheet.create({
  heading: {
    borderBottomWidth: 1,
    borderColor: '#000000',
  },
  heading1: {
    fontSize: 32,
    backgroundColor: '#000000',
    color: '#FFFFFF',
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
    // lineHeight: 10
  },
  paragraph: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});

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

const simpleText = `
Text
`;

const copy = `# h1 Heading 8-)

**This is some bold text!**

This is normal text
`;

const url = `[I'm an inline-style link](https://www.google.com)`;

storiesOf('Text', module).add('Markdown', () => (
  <StoryWrapper>
    <MarkdownConstructor style={styles} rules={rules} rawText={linebreak} />
  </StoryWrapper>
));
