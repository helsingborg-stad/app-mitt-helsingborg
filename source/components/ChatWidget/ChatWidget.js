import React, { Component } from 'react'

import { PropTypes } from 'prop-types';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, FlatList, KeyboardAvoidingView} from 'react-native';
import { Header } from 'react-navigation';

export default class ChatWidget extends Component {
    static propTypes = {
        messages: PropTypes.array,
        inputValue: PropTypes.string,
        changeHandler: PropTypes.func,
        submitHandler: PropTypes.func,
    }

    flatListRef = React.createRef();

    render() {
        const {inputValue, changeHandler, submitHandler, messages} = this.props;
        return (
            <KeyboardAvoidingView 
                style={styles.chatContainer}
                behavior="padding"
                keyboardVerticalOffset={Header.HEIGHT} // FIXME: Header.HEIGHT is deprecated & does not account for orientation or iphoneX
                enabled
              >
                <View style={styles.chatBody}>
                    <FlatList
                        ref={(flatListRef) => { this.flatListRef = flatListRef }}
                        data={messages} 
                        inverted={false}
                        refreshing={false}
                        onRefresh={() => {console.log('refreshed')}}
                        keyExtractor={(item, index) => index.toString()}
                        onContentSizeChange={() => {this.flatListRef.scrollToEnd()}}
                        onLayout={() => {this.flatListRef.scrollToEnd()}}
                        ListEmptyComponent={() => (<Text>{'Sorry .. could not find any messages 😿'}</Text>)}
                        ListFooterComponent={ <View style={{ margin: 16 }} /> }
                        renderItem={(data) => (<ChatBubble {...data.item}  />)}
                    />
                </View>
                <View>
                    <View style={styles.chatForm}>
                        <TextInput
                            style={styles.chatTextInput} 
                            value={inputValue}
                            onChangeText={changeHandler}
                            onSubmitEditing={submitHandler}
                            placeholder={'Type your message here...'}
                        />
                        <SubmitButton  submitHandler={submitHandler}  />
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const ChatBubble = props => {
    const bgColor = props.currentUser ? 'rgb(41, 128, 185)' : 'rgb(236, 240, 241)';
    const bubbleAlignment = props.currentUser ? 'flex-end' : 'flex-start';
    const borderRadiusCorner = props.currentUser ? 'borderBottomRightRadius' : 'borderBottomLeftRadius';
    const reactiveChatBubbleStyles = {
        alignSelf: bubbleAlignment, 
        backgroundColor: bgColor
    };

    reactiveChatBubbleStyles[borderRadiusCorner] = 0;

    return (
        <View 
            style={[
                styles.chatBubble, 
                reactiveChatBubbleStyles
            ]}
        >
            <Text style={props.currentUser ? {color: 'rgb(255,255,255)', textAlign: 'right'} : {}}>{props.content}</Text>
        </View>
    );
}

const SubmitButton = props => {
    return (
        <View style={styles.SubmitButtonWrapper}>
            <TouchableOpacity onPress={props.submitHandler} style={styles.SubmitButtonInner}>
                <Text style={styles.SubmitButtonText}>Send</Text>
            </TouchableOpacity>
        </View>
      );
}

const styles = StyleSheet.create({
    chatContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        paddingBottom: 0
    },
    chatBody: {
        flex: 1, 
        backgroundColor: 'rgb(255, 255, 255)'
    },
    chatBubble: {
        marginTop: 8, 
        marginHorizontal: 16,
        paddingVertical: 16, 
        paddingHorizontal: 16,
        borderRadius: 12
    },
    chatForm: {
        flexDirection: 'row',
        borderTopWidth: 0,
        backgroundColor: 'rgb(236, 240, 241)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 16
    },
    chatTextInput: {
        flex: 1, 
        height: 32, 
        padding: 8, 
        backgroundColor: 'rgb(236, 240, 241)', 
        borderColor: 'rgb(189, 195, 199)', 
        borderTopWidth: 0,
        borderRadius: 4
    },
    SubmitButtonWrapper: {
        height: 56,
    },
    SubmitButtonInner: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: 16,
        width: 80
    },
    SubmitButtonText: { 
        color: 'rgb(41, 128, 185)',
        fontWeight: 'bold' 
    }
});

