import React from 'react';
import PropTypes from 'prop-types';
import RnModal from 'react-native-modal';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ModalContainer = styled(RnModal)`
  margin-left: 0px;
  margin-right: 0px;
  margin-bottom: 0px;
  margin-top: 0px;
  border-top-left-radius: 17.5px;
  border-top-right-radius: 17.5px;
`;

const Modal = ({ visible, children, ...other }) => (
  <ModalContainer
    animationInTiming={500}
    animationOutTiming={500}
    propagateSwipe
    isVisible={visible}
    transparent
    {...other}
  >
    <SafeAreaView edges={['top', 'right', 'left']} />
    {children}
  </ModalContainer>
);

Modal.propTypes = {
  visible: PropTypes.bool.isRequired,
  children: PropTypes.any,
};

export default Modal;
