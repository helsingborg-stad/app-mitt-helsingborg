import React, { Component } from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import styled from 'styled-components/native';
import StoryWrapper from '../molecules/StoryWrapper';
import Modal from './Modal';
import Button from '../atoms/Button';
import Text from '../atoms/Text';

class ModalExample extends Component {
    state = {
        modal: {
            visible: false,
            heading: 'Modal heading',
            content: 'Modal content'
        }
    };

    setModalVisibility(visible) {
        this.setState({ modal: { visible: visible } });
    }

    render() {
        const { modal } = this.state;
        const { visible, heading, content } = modal;

        return (
            <View>
                <Modal
                    visible={visible}
                    heading={heading}
                    content={content}
                    setModalVisibility={(visible) => this.setModalVisibility(visible)}
                />

                <ModalButton
                    color={'purple'}
                    onClick={() => this.setModalVisibility(!visible)}>
                    <Text>Show modal</Text>
                </ModalButton>

            </View>
        );
    }
}

storiesOf('Modal', module)
    .add('default', () => (
        <StoryWrapper>
            <ModalExample />
        </StoryWrapper>
    ));

const ModalButton = styled(Button)`
    margin-top: 24px;
`;
