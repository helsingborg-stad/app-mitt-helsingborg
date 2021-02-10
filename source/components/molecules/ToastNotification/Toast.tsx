import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Notification } from '../../../store/NotificationContext';
import Text from '../../atoms/Text/Text';
import Icon from '../../atoms/Icon/Icon';
import theme from '../../../styles/theme';

const severityStyles = {
  neutral: {
    foregroundColor: theme.colors.neutrals[1],
    backgroundColor: 'transparent',
    icon: 'info',
  },
  success: {
    foregroundColor: theme.colors.neutrals[6],
    backgroundColor: 'green',
    icon: 'check',
  },
  info: {
    foregroundColor: theme.colors.neutrals[6],
    backgroundColor: '#F7BA70',
    icon: 'info',
  },
  warning: {
    foregroundColor: theme.colors.neutrals[6],
    backgroundColor: 'orange',
    icon: 'warning',
  },
  error: {
    foregroundColor: theme.colors.neutrals[6],
    backgroundColor: theme.colors.primary.red[3],
    icon: 'error',
  },
};

const BaseContainer = styled.View`
  position: absolute;
  z-index: 1000;
  top: ${(props) => (props.top ? `${props.top}px` : '40px')};
  left: 15%;
  right: 15%;
  bottom: 0;
  height: 60px;
  padding: 0px;
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
const IconContainer = styled.View`
  padding-horizontal: 14px;
  border-bottom-left-radius: 6px;
  border-top-left-radius: 6px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.color ? `${props.color}` : 'transparent')};
`;
const CloseButtonContainer = styled.TouchableHighlight`
  padding-horizontal: 14px;
  align-items: center;
  justify-content: center;
`;
const PrimaryText = styled(Text)`
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 3px;
`;
const SecondaryText = styled(Text)`
  font-size: 10px;
  color: #333333;
  margin-bottom: 3px;
`;

interface Props {
  notification: Notification;
  index: number;
  onClose: () => void;
}

const Toast: React.FC<Props> = ({ notification, index, onClose }) => {
  const { foregroundColor, backgroundColor, icon } = severityStyles[notification.severity];
  const { mainText, secondaryText } = notification;

  useEffect(() => {
    if (notification.autoHideDuration > 0) {
      setTimeout(onClose, notification.autoHideDuration);
    }
  }, [notification, onClose]);

  return (
    <BaseContainer top={40 + 70 * index}>
      {icon ? (
        <IconContainer color={backgroundColor}>
          <Icon color={foregroundColor} name={icon} />
        </IconContainer>
      ) : null}
      <ContentContainer>
        {mainText !== undefined && mainText.trim() !== '' && (
          <View>
            <PrimaryText numberOfLines={1}>{mainText}</PrimaryText>
          </View>
        )}
        {secondaryText !== undefined && secondaryText.trim() !== '' && (
          <View>
            <SecondaryText numberOfLines={2}>{secondaryText}</SecondaryText>
          </View>
        )}
      </ContentContainer>
      <CloseButtonContainer>
        <TouchableHighlight activeOpacity={1} onPress={onClose}>
          <Icon name="close" />
        </TouchableHighlight>
      </CloseButtonContainer>
    </BaseContainer>
  );
};

Toast.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.number,
    autoHideDuration: PropTypes.number,
    severity: PropTypes.oneOf(['success', 'info', 'warning', 'error', 'neutral']),
    mainText: PropTypes.string,
    secondaryText: PropTypes.string,
  }),
  index: PropTypes.number,
  onClose: PropTypes.func,
};

export default Toast;
