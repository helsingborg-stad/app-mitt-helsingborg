import React from 'react';
import styled from 'styled-components/native';
import { withNavigation } from 'react-navigation';

import FormAgent from '../organisms/FormAgent/FormAgent';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import Text from '../atoms/Text';
import ChatBubble from '../atoms/ChatBubble';

const ButtonStack = props => {
    const { items, children } = props;

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
            // TODO: Define click action in upper component
            clickAction: () => {
                const message = [{
                    Component: ChatBubble,
                    componentProps: {
                        content: value,
                        modifiers: ['user'],
                    }
                }];

                // Trigger custom actions
                // TODO: Type check action params
                if (action &&
                    typeof action.type !== 'undefined' &&
                    typeof action.value !== 'undefined') {
                    switch (action.type) {
                        case ('form'):
                            props.chat.switchAgent(props =>
                            <FormAgent {...props}
                                formId={action.value}
                                callback={(params) => action.callback(params)}
                            />);
                            break;
                        case ('navigate'):
                            props.navigation.navigate(action.value);
                        return;
                    }
                }

                // Add message
                props.chat.addMessages(message);
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

export default withNavigation(ButtonStack);

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
