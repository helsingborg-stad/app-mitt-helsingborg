import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';

import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import ChatBubble from '../atoms/ChatBubble';
import Input from '../atoms/Input';

const ButtonStack = props => {
    const { items, children } = props;

    renderItem = (item, index) => {
        const { icon, value } = item;

        const buttonProps = {
            label: value,
            messages: [{
                Component: ChatBubble,
                componentProps: {
                    content: value,
                    modifiers: ['user'],
                }
            }],
            iconColor: icon === 'check' 
                ? '#50811B' 
                : icon === 'close' 
                    ? '#AE0B05' 
                    : undefined,
            icon: icon ? icon : 'message'
        };

        return (
            <ActionItemWrapper key={`${item}-${index}`}>
                <ActionButton {...buttonProps} addMessages={props.chat.addMessages} />
            </ActionItemWrapper>
        );
    }

    return (
        <ButtonStackWrapper>
            {items.map(this.renderItem)}
        </ButtonStackWrapper>
    )
}

export default ButtonStack;

const ActionButton = (props) => {
    return (
        <ModifiedButton onClick={() => props.addMessages(props.messages)} color={'light'} rounded block>
            <Icon color={props.iconColor} name={props.icon} />
            <Text>{props.label}</Text>
        </ModifiedButton>
    );
};

const ButtonStackWrapper = styled.View``;

const ActionItemWrapper = styled.View`
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 6px;
  margin-bottom: 6px;
`;


const ModifiedButton = styled(Button)`
    justify-content: flex-start;
`;