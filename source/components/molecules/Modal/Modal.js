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

const Flex = styled.View`
  flex: 1;
`;

const Content = styled.ScrollView`
  background-color: ${props => props.theme.background.lightest};
`;

const Modal = ({ visible, children }) => (
  <ModalContainer
    animationInTiming={400}
    animationOutTiming={400}
    backdropOpacity={0}
    propagateSwipe
    swipeDirection="down"
    isVisible={visible}
  >
    <Flex>
      <Content>
        {/* TouchableOpacity = Hack to make scrolling work inside swipeable modal */}
        <TouchableOpacity activeOpacity={1}>{children}</TouchableOpacity>
      </Content>
    </Flex>
  </ModalContainer>
);

Modal.propTypes = {
  visible: PropTypes.bool.isRequired,
  children: PropTypes.any,
};

export default Modal;
