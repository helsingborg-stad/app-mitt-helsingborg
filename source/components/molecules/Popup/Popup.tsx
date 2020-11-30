import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Notification } from '../../../store/NotificationContext';
import Text from '../../atoms/Text/Text';
import Icon from '../../atoms/Icon/Icon';

const BaseContainer = styled.View`
  position: absolute;
  z-index: 1000;
  top: ${props => (props.top ? `${props.top}px` : '40px')};
  left: 15%;
  right: 15%;
  bottom: 0;
  padding: 0px;
  height: 400px;
  width: 70%;
  background-color: white;
  flex-direction: row;
  border-radius: 6px;
  shadow-offset: 0 0;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
`;
const ContentContainer = styled.View`
  flex: 1;
  padding-left: 12px;
  justify-content: center;
`;

interface Props {
  autoHideDuration?: number;
  onClose: () => void;
}

const Popup: React.FC<Props> = ({ autoHideDuration, onClose, children }) => {
  useEffect(() => {
    if (autoHideDuration > 0) {
      setTimeout(onClose, autoHideDuration);
    }
  }, [autoHideDuration, onClose]);
  console.log('children', children);

  return (
    <BaseContainer top={400}>
      <ContentContainer>{children}</ContentContainer>
    </BaseContainer>
  );
};

Popup.propTypes = {
  autoHideDuration: PropTypes.number,
  onClose: PropTypes.func,
  children: PropTypes.element,
};

export default Popup;
