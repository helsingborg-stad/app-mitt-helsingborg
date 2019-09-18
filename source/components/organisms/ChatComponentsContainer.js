import React, { Component } from 'react';
import { FlatList, Animated } from 'react-native';
import {
    ChatBubble,
    ChatSectionTitle,
    LoginAction,
    MoreInfo,
    MoreInfoExpanded,
    ChatForm,
    PersonalInfoAction,
    AcceptingOnLoginAction
} from '../Components';

class ChatComponentsContainer extends Component {
    constructor(props) {
        super(props);
        this.delayValue = 500;
        this.state = {
            animatedValue: new Animated.Value(0),
        }
    }

    componentDidMount = () => {
        Animated.spring(this.state.animatedValue, {
            toValue: 1,
            tension: 20,
            useNativeDriver: true
        }).start();
    }

    getCustomComponent = (key) => {
        const components = {
            loginAction: LoginAction,
            moreInfo: MoreInfo,
            moreInfoExpanded: MoreInfoExpanded,
            chatForm: ChatForm,
            personalInfoAction: PersonalInfoAction,
            acceptingOnLoginAction: AcceptingOnLoginAction,
        };
        return components[key];
    }

    renderChatComponent = ({ item }) => {
        this.delayValue = this.delayValue + 500;
        const translateX = this.state.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [this.delayValue, 1]
        });

        switch (item.type) {
            case 'component':
                const CustomChatComponent = this.getCustomComponent(item.value);
                return <CustomChatComponent
                    {...item}
                    addMessages={this.props.addMessages}
                    setActions={this.props.setActions}
                    activateFormInput={this.props.activateFormInput}
                />
            case 'chatSectionTitle':
                return <ChatSectionTitle content={item.value} modifiers={item.modifiers} />
            case 'chatBubble':
                return (
                    <Animated.View style={{ transform: [{ translateX }] }}>
                        <ChatBubble content={item.value} modifiers={item.modifiers} />
                    </Animated.View>
                );
        }
    }

    render() {
        const { listObjects } = this.props;

        return <FlatList
            ref={ref => this.scrollView = ref}
            onContentSizeChange={(contentWidth, contentHeight) => {
                this.scrollView.scrollToEnd({ animated: true });
            }}
            style={this.props.style}
            inverted={false}
            data={listObjects}
            renderItem={(item, index) => this.renderChatComponent(item, index)}
            keyExtractor={(item, index) => index.toString()}
        />
    }
}

export default ChatComponentsContainer;
