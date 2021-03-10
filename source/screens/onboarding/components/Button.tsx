import React from 'react';
import { RectButton } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

const GestureButton = styled(RectButton)`
  height: 40px;
  padding: 10px;
  background-color: transparent;
`;

const GestureButtonLabel = styled.Text`
  font-size: 15px;
  text-align: center;
`;

interface ButtonProps {
  label: string;
  onPress: () => void;
}

const Button = ({ label, onPress }: ButtonProps) => (
  <GestureButton {...{ onPress }}>
    <GestureButtonLabel>{label}</GestureButtonLabel>
  </GestureButton>
);

Button.defaultProps = { variant: 'default' };

export default Button;
