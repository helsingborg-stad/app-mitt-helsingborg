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
        return <Text key={node.key} style={markDownStyles.atomText}>{node.content}</Text>;
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
        marginLeft: 5,
        marginRight: 5,
        fontSize: 30,
        color: '#707070',
    },
    atomText: {
        fontSize: 16,
        color: '#707070',
    },
    paragraph: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
});

export default MarkdownConstructor;
