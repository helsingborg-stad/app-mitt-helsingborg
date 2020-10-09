import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import RnModal from 'react-native-modal';
import styled from 'styled-components/native';

const ModalContainer = styled(RnModal)`
  margin-left: 0px;
  margin-right: 0px;
  margin-bottom: 0px;
  margin-top: 24px;
  border-top-left-radius: 17.5px;
  border-top-right-radius: 17.5px;
`;

const ModalWrapper = styled.View({
  backgroundColor: '#00213F',
  flexGrow: 1,
});

const Content = styled.ScrollView``;

const Modal = ({ visible, children, ...other }) => (
  <ModalContainer
    animationInTiming={400}
    animationOutTiming={400}
    backdropOpacity={0}
    propagateSwipe
    swipeDirection="down"
    isVisible={visible}
    {...other}
  >
    <ModalWrapper>
      <Content>
        <TouchableOpacity activeOpacity={1}>{children}</TouchableOpacity>
      </Content>
    </ModalWrapper>
  </ModalContainer>
);

Modal.propTypes = {
  visible: PropTypes.bool.isRequired,
  children: PropTypes.any,
};

export default Modal;
