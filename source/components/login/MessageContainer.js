import React, { Component } from 'react';
import { Text, View, FlatList } from 'react-native';
import Login from './molecules/Login';
import MoreInfo from './molecules/MoreInfo';
import MoreInfoExpanded from './molecules/MoreInfoExpanded';

class MessageContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listObjects: []
        }
    }

    componentDidMount() {
        const { listObjects } = this.props;
        if (listObjects) {
            this.delayListItems(listObjects);
        }
    }

    getCustomComponent = (key) => {
        const components = {
            login: Login,
            moreInfo: MoreInfo,
            moreInfoExpanded: MoreInfoExpanded,
        };
        return components[key];
    }

    delayListItems = (listObjects) => {
        for (let i = 0; i < listObjects.length; i++) {
            setTimeout(() => {
                let objects = this.state.listObjects;
                console.log(objects);
                objects.push(listObjects[i]);
                this.setState({ listObjects: objects })
            }, 300 * i);
        }
    }

    renderItem = ({ item }) => {
        return <Text style={{ marginBottom: 15, borderRadius: 3, padding: 10, backgroundColor: '#D35098', color: 'white', fontSize: 18 }} >{item.value}</Text>
    }

    render() {
        const { listObjects } = this.state;

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

export default MessageContainer;
