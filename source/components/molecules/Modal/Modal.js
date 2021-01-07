import React from 'react';
import PropTypes from 'prop-types';
import { Modal as RnModal } from 'react-native';

const Modal = ({ visible, hide, children, ...other }) => (
  <RnModal
    statusBarTranslucent={false}
    visible={visible}
    animationType="slide"
    transparent={false}
    onRequestClose={hide}
    presentationStyle="pageSheet"
    {...other}
  >
    {children}
  </RnModal>
);

Modal.propTypes = {
  hide: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  children: PropTypes.any,
};

export default Modal;
