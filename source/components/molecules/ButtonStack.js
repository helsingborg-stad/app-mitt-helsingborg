import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';

import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import Input from '../atoms/Input';

const ButtonStack = props => {
    const { items, children } = props;

    renderItem = (item, index) => {
        const { Component, componentProps } = item;
        console.log("TCL: renderItem -> componentProps", componentProps)

        return (
            <ActionItemWrapper key={`${Component}-${index}`}>
                <Component {...componentProps} addMessages={props.chat.addMessages} />
            </ActionItemWrapper>
        );
    }

    return (
        <ButtonStackWrapper>
            {items.map(this.renderItem)}
        </ButtonStackWrapper>
    )
}


const ButtonStackWrapper = styled.View``;

export default ButtonStack

const ActionItemWrapper = styled.View`
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 6px;
  margin-bottom: 6px;
`;