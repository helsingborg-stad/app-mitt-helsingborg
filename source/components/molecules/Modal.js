import React, { Component } from 'react';
import { Modal as RNModal, Text, TouchableHighlight, View, Alert } from 'react-native';
import styled from 'styled-components/native';

const Modal = (props) =>
    <ModalContainer
        animationType="slide"
        transparent={false}
        visible={props.visible}
        onRequestClose={() => {
            Alert.alert('Modal has been closed.');
        }}>
        <ModalContent>
            <View>
                <Text>Sup World!</Text>

                <TouchableHighlight
                    onPress={() => {
                        props.setModalVisibility(!props.visible);
                    }}>
                    <Text>Hide Modal</Text>
                </TouchableHighlight>

            </View>
        </ModalContent>
    </ModalContainer>;


export default Modal;

const ModalContainer = styled(RNModal)`
    border: 1px solid green;
`;

const ModalContent = styled(View)`
    margin-top: 24px;
    border: 1px solid blue;
`;
