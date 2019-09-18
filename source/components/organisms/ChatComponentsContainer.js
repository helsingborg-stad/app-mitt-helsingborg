import React, { Component } from 'react';
import { FlatList } from 'react-native';
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

        // this.state = {
        //     listObjects: []
        // }
    }

    // componentDidMount() {
    //     const { listObjects } = this.props;
    //     if (listObjects) {
    //         this.delayListItems(listObjects);
    //     }
    // }

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

    // delayListItems = (listObjects) => {
    //     for (let i = 0; i < listObjects.length; i++) {
    //         setTimeout(() => {
    //             let objects = this.state.listObjects;
    //             console.log("Delay new object", objects);
    //             objects.push(listObjects[i]);
    //             this.setState({ listObjects: objects })
    //         }, 300 * i);
    //     }
    // }

    renderChatComponent = ({ item }) => {
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
                return <ChatBubble content={item.value} modifiers={item.modifiers} />
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
