import React, { Component } from 'react'
import { Text, View, SafeAreaView } from 'react-native'
import ChatWidgetContainer from '../ChatWidget/ChatWidgetContainer';

export default class ChatScreen extends Component {
    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <ChatWidgetContainer />
            </SafeAreaView>
        )
    }
}
