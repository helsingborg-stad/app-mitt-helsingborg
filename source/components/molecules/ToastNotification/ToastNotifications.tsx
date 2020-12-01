import React from 'react';
import PropTypes from 'prop-types';
import { Notification, Popup } from '../../../store/NotificationContext';
import Toast from './Toast';
import PopupComponent from '../../../containers/Popup/Popup';

function isNotification (n: Notification | Popup): n is Notification {
  return Object.prototype.hasOwnProperty.call(n, 'severity');
}

interface Props {
  notifications: (Notification | Popup)[];
  removeNotification: (id: number) => void;
}
const ToastNotifications: React.FC<Props> = ({ notifications, removeNotification }) => {
  const mapToComponent = (n: Notification | Popup, index: number) => {
    if (isNotification(n)) {
      return <Toast key={n.id} index={index} notification={n} onClose={() => removeNotification(n.id)} />; 
    } else {
      return <PopupComponent key={n.id} onClose={() => removeNotification(n.id)} renderPopup={n.renderPopup} />;
    }
  }
  
  return (
    <>
      {notifications.map(mapToComponent)}
    </>
  );
}

ToastNotifications.propTypes = {
  notifications: PropTypes.array,
  removeNotification: PropTypes.func,
};

export default ToastNotifications;
