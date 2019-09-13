import React, { Component } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const AUTOMATED_MESSAGES = [
    {
        type: 'string',
        size: 'lg',
        value: "Absolut!"
    },
    {
        type: 'string',
        size: 'md',
        value: "Med Mitt Helsingborg kommunicerar du med staden och får tillgång till alla tjänster du behöver."
    },
];

class MoreInfo extends Component {
    constructor(props) {
        super(props);
    }

    showMoreInfo = () => {
        this.props.addMessages(
            AUTOMATED_MESSAGES,
        );
    }

    render() {
        //console.log("index", this.props.index);

        return (
            <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={() => this.showMoreInfo()}
                underlayColor='#fff'
            >
                <Text
                    style={[styles.buttonText, styles.buttonPrimaryText]}
                    accessible={true}
                >Berätta mer</Text>
            </TouchableOpacity >
        );
    }
};

export default MoreInfo;

const styles = StyleSheet.create({
    button: {
        marginBottom: 15,
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 7,
        shadowOpacity: 0.3,
        shadowRadius: 7,
        shadowColor: '#000',
        shadowOffset: { height: 1, width: 0 },
    },
    buttonPrimary: {
        backgroundColor: '#007AFF',
    },
    buttonDisabled: {
        backgroundColor: '#E5E5EA',
    },
    buttonText: {
        fontSize: 18,
        color: '#005C86',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    buttonPrimaryText: {
        color: '#fff',
    },
    buttonTextDisabled: {
        color: '#C7C7CC',
    },
});
