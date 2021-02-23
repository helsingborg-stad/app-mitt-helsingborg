import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

const GestureButton = styled(RectButton)`
  height: 20px;
  background-color: transparent;
`;

const GestureButtonLabel = styled.Text`
  font-size: 15px;
  text-align: center;
`;

interface ButtonProps {
  label: string;
  variant: 'default' | 'primary';
  onPress: () => void;
}

const Button = ({ label, onPress }: ButtonProps) => (
  <GestureButton {...{ onPress }}>
    <GestureButtonLabel>{label}</GestureButtonLabel>
  </GestureButton>
);

Button.defaultProps = { variant: 'default' };

export default Button;
