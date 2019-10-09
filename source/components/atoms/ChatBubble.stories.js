import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../molecules/StoryWrapper';
import ChatBubble from './ChatBubble';
import Text from './Text';

storiesOf('Chat', module)
    .add('ChatBubble', () => (
        <StoryWrapper>           
            <ChatBubble content="User modifier (using props.content instead of children)"/>
            <ChatBubble modifiers={['automated']}>
                <Text>Automated modifier</Text>
            </ChatBubble>
            <ChatBubble modifiers={['human']}>
                <Text>Human modifier</Text>
            </ChatBubble>
        </StoryWrapper>
));

