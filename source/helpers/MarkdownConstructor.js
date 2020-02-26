import PropTypes from 'prop-types';
import React from 'react';
import Markdown from 'react-native-markdown-display';
import Text from '../components/atoms/Text';

/**
 * Override markdown rules.
 *
 * Using own custom implementation of Text (...atoms/Text).
 *
 */
const markdownRules = {
  text: node => <Text key={node.key}>{node.content}</Text>,
  strong: (node, children, _parent, _styles) => (
    <Text key={node.key}>
      {React.Children.map(children, (child, _index) =>
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

const MarkdownConstructor = props => {
  const { rawText } = props;

  return (
    <Markdown rules={markdownRules} style={markDownStyles}>
      {rawText}
    </Markdown>
  );
};

MarkdownConstructor.propTypes = {
  rawText: PropTypes.string,
};

export default MarkdownConstructor;
