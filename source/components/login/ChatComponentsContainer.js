import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { Message, Separator, LoginAction, MoreInfo, MoreInfoExpanded, ChatForm, PersonalInfoAction } from './Components';

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

    renderItem = ({ item }) => {
        switch (item.type) {
            case 'component':
                const CustomComponent = this.getCustomComponent(item.value);
                return (
                    <CustomComponent
                        {...item}
                        addMessages={this.props.addMessages}
                        setActions={this.props.setActions}
                        activateFormInput={this.props.activateFormInput}
                    />);
            case 'separator':
                return <Separator content={item.value} modifiers={item.modifiers} />
            default:
                return <Message content={item.value} modifiers={item.modifiers} />
        }
    }

    render() {
        const { listObjects } = this.props;

        return (
            <FlatList
                inverted={false}
                data={listObjects}
                renderItem={(item, index) => this.renderItem(item, index)}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingTop: 10, paddingBottom: 10 }}
            />
        )
    }
}

export default ChatComponentsContainer;
