import React from "react";
import { StyleSheet } from "react-native"
import Markdown from "react-native-markdown-renderer";
import Text from "../components/atoms/Text";

const MarkdownConstructor = props => {
    const { rawText } = props;

    return (
        <Markdown rules={markdownRules} style={markDownStyles}> { rawText } </Markdown>
    );
};

/**
 * Override markdown rules.
 *
 * Using own custom implementation of Text (...atoms/Text).
 *
 */
const markdownRules = {
    text: (node) => {
        return <Text style={markDownStyles.atomText} key={node.key}>{node.content}</Text>;
    },
    strong: (node, children, parent, styles) => {
        return (
            <Text key={node.key}>
                {React.Children.map(children, (child, index) => {
                    return React.createElement(child.type, { ...child.props, strong: true });
                })}
            </Text>
        );
    },
};

/**
 * Override markdown styles.
 *
 * paragraph: Removed padding top/bottom.
 */
const markDownStyles = StyleSheet.create({
    listUnorderedItemIcon: {
        lineHeight: 22,
        marginLeft: 4,
        marginRight: 8,
        fontSize: 22,
        fontWeight: '800',
        color: '#707070',
        fontFamily: 'Roboto'
    },
    atomText: {
        fontSize: 16,
        color: '#565656',
        lineHeight: 22
    },
    paragraph: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
});

export default MarkdownConstructor;
