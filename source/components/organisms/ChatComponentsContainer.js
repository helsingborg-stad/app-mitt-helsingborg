import React, { Component } from 'react';
import { FlatList, Animated } from 'react-native';
import ChatBubble from '../atoms/ChatBubble';
import ChatSectionTitle from '../atoms/ChatSectionTitle';
import LoginAction from '../molecules/LoginAction';
import MoreInfo from '../molecules/MoreInfo';
import MoreInfoExpanded from '../molecules/MoreInfoExpanded';
import ChatForm from '../molecules/ChatFormDeprecated';
import PersonalInfoAction from '../molecules/PersonalInfoAction';
import AcceptingOnLoginAction from '../molecules/AcceptingOnLoginAction';

class ChatComponentsContainer extends Component {
  constructor(props) {
    super(props);
    this.delayValue = 500;
    this.state = {
      animatedValue: new Animated.Value(0),
    };
  }

  componentDidMount = () => {
    Animated.spring(this.state.animatedValue, {
      toValue: 1,
      tension: 20,
      useNativeDriver: true,
    }).start();
  };

  getCustomComponent = key => {
    const components = {
      loginAction: LoginAction,
      moreInfo: MoreInfo,
      moreInfoExpanded: MoreInfoExpanded,
      chatForm: ChatForm,
      personalInfoAction: PersonalInfoAction,
      acceptingOnLoginAction: AcceptingOnLoginAction,
    };
    return components[key];
  };

  renderChatComponent = ({ item }) => {
    this.delayValue += 500;
    const translateX = this.state.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [this.delayValue, 1],
    });

    switch (item.type) {
      case 'component':
        const CustomChatComponent = this.getCustomComponent(item.value);
        return (
          <CustomChatComponent
            {...item}
            addMessages={this.props.addMessages}
            setActions={this.props.setActions}
            activateFormInput={this.props.activateFormInput}
          />
        );
      case 'chatSectionTitle':
        return <ChatSectionTitle content={item.value} modifiers={item.modifiers} />;
      case 'chatBubble':
        return (
          <Animated.View style={{ transform: [{ translateX }] }}>
            <ChatBubble content={item.value} modifiers={item.modifiers} />
          </Animated.View>
        );
    }
  };

  render() {
    const { listObjects, inverted, scrollEnabled } = this.props;

    return (
      <FlatList
        style={this.props.style}
        inverted={inverted}
        scrollEnabled={scrollEnabled}
        data={inverted ? [...listObjects].reverse() : listObjects}
        renderItem={(item, index) => this.renderChatComponent(item, index)}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }
}

export default ChatComponentsContainer;
