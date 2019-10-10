import React, { Component } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

const ChatBody = styled.View`
    flex: 1;
    background-color: ${props => props.theme.chatBody.background};
    padding-top: 32px;
`;

export default ChatBody;