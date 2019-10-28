import React from 'react';
import { Keyboard, TextInput, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Input from '../atoms/Input';
import styled from 'styled-components/native';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';

const ChatForm = props => {
    const { style, renderFooter, submitHandler, changeHandler, inputValue, isFocused } = props;
    const formProps = {submitHandler, changeHandler, inputValue};

    const children = props.children
        ? React.Children.map(props.children, (child, index) => {
            if (!child.type) {
                return child;
            }

            if (child.type === Input) {
                return React.createElement(child.type, {onChangeText: changeHandler, value: inputValue, onSubmitEditing: submitHandler, ...child.props })
            }

            return React.createElement(child.type, {form: {...formProps}, ...child.props});
        })
        : false;

    return (
        <ChatFormWrapper>
            <ChatFormBody style={style}>

                {isFocused &&
                    <ChatFormButton onClick={Keyboard.dismiss} block={false} z={0}>
                        <Icon name="keyboard" />
                    </ChatFormButton>
                }

                {
                    children
                    ? children
                    : <Input
                        value={inputValue}
                        onChangeText={changeHandler}
                        onSubmitEditing={submitHandler}
                        placeholder={'Skriv något... '}
                        keyboardType={'default'}
                        focus
                    />
                }

                <Button onClick={submitHandler} z={0}>
                    {
                        props.submitText
                        ? <Text>{props.submitText}</Text>
                        : <Icon name="send"/>
                    }
                </Button>
            </ChatFormBody>

            {
                renderFooter ?
                (
                    <ChatFormFooter>
                        {renderFooter()}
                    </ChatFormFooter>
                )
                : null
            }
        </ChatFormWrapper>

    );
}

export default ChatForm;

const ChatFormWrapper = styled.View``;
const ChatFormFooter = styled.View``;
const ChatFormBody = styled.View`
  margin-top: 12px;
  margin-bottom: 6px;
  margin-left: 16px;
  margin-right: 16px;
  flex-direction: row;
`;
const ChatFormButton = styled(Button)`
    padding: 0px 16px 0px 0px;
    background: transparent;
`;

