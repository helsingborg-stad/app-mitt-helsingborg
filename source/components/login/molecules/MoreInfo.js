import React, { Component } from 'react';
import Button from '../atoms/Button';

const MESSAGES = [
    {
        type: 'string',
        modifier: 'user',
        size: 'md',
        value: "Berätta mer"
    },
    {
        type: 'string',
        modifier: 'automated',
        size: 'lg',
        value: "Absolut!"
    },
    {
        type: 'string',
        modifier: 'automated',
        size: 'md',
        value: "Med Mitt Helsingborg kommunicerar du med staden och får tillgång till alla tjänster du behöver."
    },
    {
        type: 'string',
        modifier: 'automated',
        size: 'md',
        value: "Med Mitt Helsingborg kommunicerar du med staden och får tillgång till alla tjänster du behöver."
    },
];

const ACTIONS = [
    {
        type: 'separator',
        size: 'sm',
        value: "Hur vill du fortsätta?"
    },
    {
        type: 'component',
        size: 'md',
        value: "login"
    },
    {
        type: 'component',
        size: 'md',
        value: "moreInfoExpanded"
    },
]

class MoreInfo extends Component {
    constructor(props) {
        super(props);
    }

    showMoreInfo = () => {
        console.log("LELLELE");
        this.props.addMessages(
            MESSAGES
        );

        this.props.setActions(
            ACTIONS
        );
    }

    render() {
        return <Button
            value={'Berätta mer'}
            modifier={'primary'}
            onClick={this.showMoreInfo} />;
    }
};

export default MoreInfo;
