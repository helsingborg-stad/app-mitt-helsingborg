/* eslint-disable react/display-name */
/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
import React from 'react';
import Markdown from 'react-native-markdown-display';
import Text from '../components/atoms/Text';

const MarkdownConstructor = props => {
  const { rawText } = props;

  return (
    <Markdown rules={markdownRules} style={markDownStyles}>
      {rawText}
    </Markdown>
  );
};

/**
 * Override markdown rules.
 *
 * Using own custom implementation of Text (...atoms/Text).
 *
 */
const markdownRules = {
  text: node => <Text key={node.key}>{node.content}</Text>,
  strong: (node, children, parent, styles) => (
    <Text key={node.key}>
      {React.Children.map(children, (child, index) =>
        React.createElement(child.type, { ...child.props, strong: true })
      )}
    </Text>
  ),
};

/**
 * Override markdown styles.
 *
 * paragraph: Removed padding top/bottom.
 */
const markDownStyles = {
  listUnorderedItemIcon: {
    lineHeight: 22,
    marginLeft: 4,
    marginRight: 8,
    fontSize: 22,
    fontWeight: '800',
    color: '#707070',
    fontFamily: 'Roboto',
  },
  paragraph: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
};

export default MarkdownConstructor;
