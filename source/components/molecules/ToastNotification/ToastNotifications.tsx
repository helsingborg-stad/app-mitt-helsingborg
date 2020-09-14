import React from 'react';
import PropTypes from 'prop-types';
import { Notification } from '../../../store/NotificationContext';
import Toast from './Toast';

interface Props {
  notifications: Notification[];
  removeNotification: (id: number) => void;
}
const ToastNotifications: React.FC<Props> = ({ notifications, removeNotification }) => (
  <>
    {notifications.map((n, index) => (
      <Toast key={n.id} index={index} notification={n} onClose={() => removeNotification(n.id)} />
    ))}
  </>
);

ToastNotifications.propTypes = {
  notifications: PropTypes.array,
  removeNotification: PropTypes.func,
};

export default ToastNotifications;
