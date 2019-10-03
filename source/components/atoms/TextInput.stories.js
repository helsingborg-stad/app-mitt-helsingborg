import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../molecules/StoryWrapper';
import TextInput from './TextInput';
import withChatForm from '../organisms/withChatForm';
import withForm from '../organisms/withForm';

storiesOf('TextInput', module)
    .add('default', () => (
        <StoryWrapper>
            <TextInput value={'Text input'} />
        </StoryWrapper>
    ))
    .add('placeholder', () => (
        <StoryWrapper>
            <TextInput placeholder={'Placeholder'} />
        </StoryWrapper>
    ))
    .add('interactive', () => {
        const TextInputWithForm = withForm(({changeHandler, inputValue}) => (
            <TextInput value={inputValue} onChangeText={changeHandler} placeholder={'Type something'} />
        ));

        return (
            <StoryWrapper>
                <TextInputWithForm />
            </StoryWrapper>
        )
    })


