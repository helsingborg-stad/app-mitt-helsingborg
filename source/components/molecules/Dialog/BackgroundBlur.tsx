import React from 'react';
import styled from 'styled-components/native';
import { BlurView } from '@react-native-community/blur';

export const BackgroundBlur = styled(BlurView)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

export default BackgroundBlur;
