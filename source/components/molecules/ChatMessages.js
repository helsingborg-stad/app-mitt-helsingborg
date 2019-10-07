import React, { Component } from 'react';
import { Text, View, FlatList } from 'react-native';
import styled from 'styled-components/native';
import ChatBubble from '../atoms/ChatBubble';
import { PropTypes } from 'prop-types';

const ChatMessagesFlatList = styled.FlatList`
    flex-basis: 100%;
`;

class ChatMessages extends Component {
    static propTypes = {
        messages: PropTypes.arrayOf(
            PropTypes.shape({
                Component: PropTypes.elementType,
                componentProps: PropTypes.object
            })
        ),
        forwardProps: PropTypes.object
    }

    // Required to scroll FlatList
    flatListRef = React.createRef();

    renderItem = ({item, index}) => {
        const {Component, componentProps} = item;
        return <Component {...componentProps} />;
    }

    render() {
        const {messages, forwardProps} = this.props;
        
        return (
            <ChatMessagesFlatList 
                ref={(flatListRef) => { this.flatListRef = flatListRef }}
                scrollEnabled={true}
                inverted={false}
                data={[...messages]}
                renderItem={this.renderItem}
                onContentSizeChange={() => {this.flatListRef.scrollToEnd()}}
                onLayout={() => {this.flatListRef.scrollToEnd()}}
                keyExtractor={(item, index) => index.toString()}
                {...forwardProps}
            />
        )
    }
}

export default ChatMessages;
