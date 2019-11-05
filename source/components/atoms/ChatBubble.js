import React from 'react';
import { StyleSheet, View } from 'react-native';
import styled, {css} from 'styled-components/native';
import Text from './Text';
import Heading from './Heading';
import shadow from '../../styles/shadow';
import PropTypes from 'prop-types';

import Icon from './Icon';
import Button from './Button';

const ChatBubble = props => {
    const { content, modifiers, style, iconRight, onClickIconRight } = props;

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
                <ContentWrapper>
                    <Body>
                        {children ? 
                            children
                        : content ?
                            <BubbleText colorTheme={colorTheme}>
                                {content}
                            </BubbleText>
                        : null}
                    </Body>
                    {
                        iconRight && onClickIconRight ?
                            <Aside>
                                <IconButton onClick={onClickIconRight} z={0}><Icon color={"#000000"} name={iconRight} /></IconButton>
                            </Aside>
                        : null
                    }
                </ContentWrapper>

        </Bubble>
    );
}

ChatBubble.propTypes = {
    modifiers: PropTypes.arrayOf(PropTypes.oneOf(['automated', 'human', 'user'])),
    content: PropTypes.string,
    onClickIconRight: PropTypes.func,
    iconRight: PropTypes.string
};

ChatBubble.defaultProps = {
    modifiers: ['user'],
    iconRight: 'help-outline'
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

const IconButton = styled(Button)`
    padding: 0;
    padding-top: 0;
    padding-bottom: 0;
    min-height: auto;
`;
const ContentWrapper = styled.View`
    flex-direction: row;
    flex-wrap: nowrap;
`;

const Body = styled.View`
    flex-shrink: 1;
`;
const Aside = styled.View`
    flex-basis: 42px;
    border-left-width: 1px;
    border-left-color: ${props => (props.theme.border.default)};
    align-items: flex-end;
    margin-left: 16px;
`;
