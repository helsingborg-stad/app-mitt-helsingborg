/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-shadow */
/* eslint-disable react/sort-comp */
/* eslint-disable react/static-property-placement */
import React, { Component } from 'react';
import { Text, View, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { PropTypes } from 'prop-types';
import ChatBubble from '../../atoms/ChatBubble';

const OFFSET_TOP = 0;
const OFFSET_BOTTOM = 24;

const ChatMessagesFlatList = styled.FlatList`
  flex-basis: 100%;
  margin-top: 24px;
`;

class ChatMessages extends Component {
  static propTypes = {
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        Component: PropTypes.elementType,
        componentProps: PropTypes.object,
      })
    ),
    forwardProps: PropTypes.object,
    chat: PropTypes.object,
  };

  // Required to scroll FlatList
  flatListRef = React.createRef();

  /**
   * Adds custom actions to component props
   * @param {obj} componentProps
   */
  mapComponentProps = componentProps => {
    const { chat } = this.props;
    const { explainer } = componentProps;

    // Modal click event handler
    if (typeof explainer !== 'undefined' && explainer.heading && explainer.content) {
      componentProps.onClickIconRight = () => {
        chat.changeModal(true, explainer.heading, explainer.content);
      };
    }

    return componentProps;
  };

  renderItem = ({ item, index }) => {
    const { Component } = item;
    let { componentProps } = item;
    componentProps = this.mapComponentProps(componentProps);

    return <Component {...componentProps} />;
  };

  render() {
    const { messages, forwardProps, chat } = this.props;

    return (
      <ChatMessagesFlatList
        ref={flatListRef => {
          this.flatListRef = flatListRef;
        }}
        scrollEnabled
        inverted={false}
        data={[...messages]}
        renderItem={this.renderItem}
        onContentSizeChange={() => {
          this.flatListRef.scrollToOffset({ offset: [...messages].length * 500, animted: true });
        }}
        onLayout={() => {
          this.flatListRef.scrollToOffset({ offset: [...messages].length * 500, animted: true });
        }}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={chat.isTyping ? TypeIndicator : null}
        contentInset={{ top: OFFSET_TOP, left: 0, bottom: OFFSET_BOTTOM, right: 0 }}
        {...forwardProps}
      />
    );
  }
}

const TypeIndicator = props => (
  <ChatBubble z={0} modifiers={['automated']}>
    <Text>•••</Text>
  </ChatBubble>
);

export default ChatMessages;
