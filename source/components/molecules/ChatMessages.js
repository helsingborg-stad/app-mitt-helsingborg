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

    // TODO: Ange proptypes för Chat prop

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
