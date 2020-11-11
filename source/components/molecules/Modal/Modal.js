import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import RnModal from 'react-native-modal';
import styled from 'styled-components/native';

const ModalContainer = styled(RnModal)`
  margin-left: 0px;
  margin-right: 0px;
  margin-bottom: 0px;
  margin-top: 30px;
  border-top-left-radius: 17.5px;
  border-top-right-radius: 17.5px;
`;

const ModalWrapper = styled.View`
  background-color: yellow;
  flex-grow: 1;
`;
const ModalFooter = styled.View`
  background-color: #00213f;
  flex-grow: 1000;
`;

const Content = styled.ScrollView`
  flex-direction: column;
`;
// swipeDirection="down"
const Modal = ({ visible, children, ...other }) => (
  <ModalContainer
    animationInTiming={500}
    animationOutTiming={500}
    propagateSwipe
    swipeDirection="down"
    isVisible={visible}
    {...other}
  >
    <Content>
      <TouchableOpacity activeOpacity={1}>{children}</TouchableOpacity>
    </Content>
    <ModalFooter />
  </ModalContainer>
);

Modal.propTypes = {
  visible: PropTypes.bool.isRequired,
  children: PropTypes.any,
};

export default Modal;
