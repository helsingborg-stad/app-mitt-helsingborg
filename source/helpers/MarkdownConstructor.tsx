import PropTypes from "prop-types";
import React, { useRef } from "react";
import Markdown from "react-native-markdown-display";
import Text from "../components/atoms/Text";

/**
 * Override markdown rules.
 *
 * Using own custom implementation of Text (...atoms/Text).
 *
 */
const markdownRules = (italic: boolean) => ({
  text: (node) => (
    <Text italic={italic} key={node.key}>
      {node.content}
    </Text>
  ),
  strong: (node, children, _parent, _styles) => (
    <Text key={node.key}>
      {React.Children.map(children, (child, _index) =>
        React.createElement(child.type, { ...child.props, strong: true })
      )}
    </Text>
  ),
});

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
    fontWeight: "800",
    color: "#707070",
  },
  paragraph: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  bullet_list: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
};

interface Props {
  rawText: string;
  italic: boolean;
}
const MarkdownConstructor = ({ rawText, italic }: Props): JSX.Element => {
  const rules = useRef(markdownRules(italic));

  return (
    <Markdown rules={rules.current} style={markDownStyles}>
      {rawText}
    </Markdown>
  );
};

MarkdownConstructor.propTypes = {
  rawText: PropTypes.string,
};

export default MarkdownConstructor;
