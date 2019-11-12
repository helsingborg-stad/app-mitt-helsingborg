import React, { Component } from 'react';
import { Text, View, FlatList } from 'react-native';
import styled from 'styled-components/native';
import ChatBubble from '../atoms/ChatBubble';
import { PropTypes } from 'prop-types';

const ChatMessagesFlatListWrapper = styled.View`
    flex: 1;
`;

const ChatMessagesFlatList = styled.FlatList`
    flex-grow: 0;
    margin-bottom: 24px;
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

 /**
     * Adds custom actions to component props
     * @param {obj} componentProps
     */
    mapComponentProps = (componentProps) => {
        const { chat } = this.props;
        const { explainer } = componentProps;

        // Modal click event handler
        if (typeof explainer !== 'undefined' && explainer.heading && explainer.content) {
            componentProps.onClickIconRight = () => {
                chat.changeModal(
                    true, explainer.heading, explainer.content
                )
            }
        }

        return componentProps;
    }

    renderItem = ({ item, index }) => {
        const { Component } = item;
        let { componentProps } = item;
        componentProps = this.mapComponentProps(componentProps);

        return <Component {...componentProps} />;
    }

    render() {
        const {messages, forwardProps} = this.props;

        return (
            <ChatMessagesFlatListWrapper>
            <ChatMessagesFlatList 
                ref={(flatListRef) => { this.flatListRef = flatListRef }}
                scrollEnabled={true}
                keyExtractor={(item, index) => index.toString()}
                inverted

                onLayout={() => {this.flatListRef.scrollToOffset({offset: 0, animted: true})}}
                onContentSizeChange={() => {this.flatListRef.scrollToOffset({offset: 0, animted: true})}}
                
                // data={[...messages]}                
                data={[...messages].reverse()}                
                
                renderItem={this.renderItem}
                
                {...forwardProps}
            />
            </ChatMessagesFlatListWrapper>
        )
    }
}

export default ChatMessages;