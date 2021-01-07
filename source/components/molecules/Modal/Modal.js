import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal as RnModal } from 'react-native';

const Modal = ({ visible, children, setVisibility, ...other }) => (
  <RnModal
    statusBarTranslucent={false}
    visible={visible}
    animationType="slide"
    transparent={false}
    onRequestClose={() => {
      if (setVisibility) {
        setVisibility(false);
      }
    }}
    presentationStyle="pageSheet"
    {...other}
  >
    {children}
  </RnModal>
);

Modal.propTypes = {
  visible: PropTypes.bool.isRequired,
  children: PropTypes.any,
};

export default Modal;
