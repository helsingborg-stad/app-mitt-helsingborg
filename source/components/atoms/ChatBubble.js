import React from 'react';
import { StyleSheet, View } from 'react-native';
import styled, {css} from 'styled-components/native';
import Text from './Text';
import Heading from './Heading';
import shadow from '../../styles/shadow';
import PropTypes from 'prop-types';

const ChatBubble = props => {
    const { content, modifiers, style } = props;

    const avalibleColorModifiers = ['automated', 'human', 'user'];
    let colorTheme = modifiers ? modifiers.find(modifier => (avalibleColorModifiers.includes(modifier))) : undefined;
    colorTheme = colorTheme ? colorTheme : 'user'; // Default theme

    const alignment = colorTheme === 'user' ? 'right' : 'left';

    /** Override child components */
    const children = React.Children.map(props.children, (child, index) => {
        /** Heading */
        if (child.type === Heading) {
            return React.createElement(BubbleHeading, {...child.props, colorTheme: colorTheme});
        }

        /** Text */
        if (child.type === Text) {
            return React.createElement(BubbleText, {...child.props, colorTheme: colorTheme});
        }

        return child;
    });

    return (
        <Bubble alignment={alignment} colorTheme={colorTheme} style={style}>
                {children ? 
                    children
                : content ?
                    <BubbleText colorTheme={colorTheme}>
                        {content}
                    </BubbleText>
                : null}
        </Bubble>
    );
}

ChatBubble.propTypes = {
    modifiers: PropTypes.arrayOf(PropTypes.oneOf(['automated', 'human', 'user'])),
    content: PropTypes.string,
};

ChatBubble.defaultProps = {
    modifiers: ['user']
};

export default ChatBubble;

const Bubble = styled.View`  
    margin-top: 6px;
    margin-bottom: 6px;
    margin-left: 16px;
    margin-right: 16px;
    padding: 14px 18px 12px 18px;
    background-color: gray;
    border-radius: 17.5px;
    align-self: flex-start;
    background-color: ${props => (props.theme.chatBubble[props.colorTheme].background)};

    ${props => ((props.alignment && CSS[props.alignment]) ? CSS[props.alignment] : null)}
    ${props => (shadow[1])}
`;

const BubbleHeading = styled(Heading)`
    color: ${props => (props.theme.chatBubble[props.colorTheme].text)};
`;

const BubbleText = styled(Text)`
    color: ${props => (props.theme.chatBubble[props.colorTheme].text)};
    font-size: 16px;
`;

const CSS = {};

CSS.left = css`
    align-self: flex-start;
    border-bottom-left-radius: 4px;
    margin-right: 96px;
`;
CSS.right = css`
    align-self: flex-end;
    border-bottom-right-radius: 4px;
    margin-left: 96px;
`;