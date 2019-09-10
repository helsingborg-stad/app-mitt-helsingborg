import React, { Component } from 'react';
import { Text, View, FlatList } from 'react-native';
import LoginAction from './LoginAction';
import MoreInfoAction from './MoreInfoAction';

class ConversationList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listItems: []
        }
    }

    componentDidMount() {
        this.setState({
            listItems: this.props.listItems
        })
    }

    getCustomComponent = (key) => {
        const components = {
            login: LoginAction,
            moreInfo: MoreInfoAction,
        };
        return components[key];
    }

    addListItems = (items) => {
        const { listItems } = this.state;

        const newListItems = listItems.concat(items);

        console.log(newListItems);

        this.setState({
            listItems: newListItems
        });
    }

    renderItem = ({ item, index }) => {
        switch (item.type) {
            case 'component':
                const CustomComponent = this.getCustomComponent(item.value);
                return (
                    <CustomComponent
                        key={index}
                        {...item}
                        addListItems={this.addListItems.bind(this)}
                    />);
            case 'separator':
                return <View style={{ backgroundColor: 'gray', borderRadius: 3, padding: 10, marginBottom: 15 }}>
                    <Text style={{ color: 'white', fontSize: 18 }} >{item.value}</Text>
                </View>
            default:
                return <Text style={{ marginBottom: 15, borderRadius: 3, padding: 10, backgroundColor: '#D35098', color: 'white', fontSize: 18 }} >{item.value}</Text>
        }
    }

    render() {
        const { listItems } = this.state;

        return (
            <FlatList
                inverted={false}
                data={listItems}
                renderItem={(item, index) => this.renderItem(item, index)}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingTop: 10, paddingBottom: 10 }}
            />
        )
    }
}

export default ConversationList;
