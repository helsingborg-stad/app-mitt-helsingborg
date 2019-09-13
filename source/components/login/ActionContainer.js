import React, { Component } from 'react';
import { Text, View, FlatList } from 'react-native';
import Login from './molecules/Login';
import MoreInfo from './molecules/MoreInfo';
import MoreInfoExpanded from './molecules/MoreInfoExpanded';
import Separator from './atoms/Separator';

class ActionContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listObjects: []
        }
    }

    componentDidMount() {
        this.setState(
            { listObjects: this.props.listObjects }
        );
    }

    getCustomComponent = (key) => {
        const components = {
            login: Login,
            moreInfo: MoreInfo,
            moreInfoExpanded: MoreInfoExpanded,
        };
        return components[key];
    }

    renderItem = ({ item, index }) => {
        console.log(item.value);

        switch (item.type) {
            case 'component':
                const CustomComponent = this.getCustomComponent(item.value);
                return (
                    <CustomComponent
                        index
                        {...item}
                        addMessages={this.props.addMessages}
                    />);
            case 'separator':
                return <Separator content={item.value} />
            default:
                return <Text style={{ marginBottom: 15, borderRadius: 3, padding: 10, backgroundColor: '#D35098', color: 'white', fontSize: 18 }} >{item.value}</Text>
        }
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

export default ActionContainer;
