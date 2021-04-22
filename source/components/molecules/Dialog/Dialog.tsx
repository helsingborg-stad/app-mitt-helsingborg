import React from 'react';
import styled from 'styled-components/native';
import { BlurView } from '@react-native-community/blur';
import { Modal } from '../Modal';
import Body from './Body';
import Wrapper from './Wrapper';
import BackgroundBlur from './BackgroundBlur';

export interface Props {
  children?: any;
  visible: boolean;
}

/** Simple popup dialog asking the user if they really want to exit the form. Partially asks the background. */
const Dialog: React.FC<Props> = ({ visible, children }) => (
  <Modal
    visible={visible ?? true}
    hide={() => {}}
    transparent
    presentationStyle="overFullScreen"
    animationType="fade"
    statusBarTranslucent
  >
    <Wrapper>
      <Body>{children}</Body>
      <BackgroundBlur blurType="dark" blurAmount={15} reducedTransparencyFallbackColor="white" />
    </Wrapper>
  </Modal>
);

export default Dialog;
