import React, { Component } from 'react';
import { FlatList } from 'react-native';
import Login from './molecules/Login';
import MoreInfo from './molecules/MoreInfo';
import MoreInfoExpanded from './molecules/MoreInfoExpanded';
import Message from './atoms/Message';
import Separator from './atoms/Separator';

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
            login: Login,
            moreInfo: MoreInfo,
            moreInfoExpanded: MoreInfoExpanded,
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
                    />);
            case 'separator':
                return <Separator content={item.value} />
            default:
                return <Message content={item.value} modifier={item.modifier} />
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
