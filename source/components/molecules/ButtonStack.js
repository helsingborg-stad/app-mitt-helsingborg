import React from 'react';
import styled from 'styled-components/native';

import FormAgent from '../organisms/FormAgent/FormAgent';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import Text from '../atoms/Text';
import ChatBubble from '../atoms/ChatBubble';

const ButtonStack = props => {
    const { items, children, isFocused } = props;

    if (isFocused) {
        return null;
    }

    renderItem = (item, index) => {
        const { icon, value, action } = item;

        const buttonProps = {
            label: value,
            iconColor: icon === 'check'
                ? '#50811B'
                : icon === 'close'
                    ? '#AE0B05'
                    : undefined,
            icon: icon ? icon : 'message',
            clickAction: () => {
                const message = [{
                    Component: ChatBubble,
                    componentProps: {
                        content: value,
                        modifiers: ['user'],
                    }
                }];
                // Add message
                props.chat.addMessages(message);
                // Trigger custom actions
                if (action && action.type === 'form') {
                    props.chat.switchAgent(props => <FormAgent {...props} formId={action.value} />);
                }
            }
        };

        return (
            <ActionButton {...buttonProps} key={`${item}-${index}`} />
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
        <ModifiedButton onClick={props.clickAction} color={'light'} rounded block>
            <Icon color={props.iconColor} name={props.icon} />
            <Text>{props.label}</Text>
        </ModifiedButton>
    );
};

const ButtonStackWrapper = styled.View``;

const ModifiedButton = styled(Button)`
    justify-content: flex-start;
    margin-left: 16px;
    margin-right: 16px;
    margin-top: 6px;
    margin-bottom: 6px;
`;
