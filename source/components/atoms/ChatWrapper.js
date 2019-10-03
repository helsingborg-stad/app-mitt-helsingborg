import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, SafeAreaView, View } from 'react-native';
import styled from 'styled-components/native';

const ChatWrapper = styled(KeyboardAvoidingView)`
    flex: 1;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding-bottom: 0;
    background-color: #F5F5F5;
`;

ChatWrapper.defaultProps = {
    behavior: 'padding',
    enabled: true
}

export default ChatWrapper;