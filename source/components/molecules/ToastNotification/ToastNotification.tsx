import React from "react";
import { Notification } from "../../../store/NotificationContext";
import BaseToast from "./Toast";

interface Props {
  notifications: Notification[];
  removeNotification: (id: number) => void;
}
const Notifications: React.FC<Props> = ({
  notifications,
  removeNotification,
}) => (
  <>
    {notifications.map((n, index) => (
      <BaseToast
        key={n.id}
        color="red"
        index={index}
        text1={n.message}
        text2="secondary text"
        icon="edit"
        onClose={() => removeNotification(n.id)}
      ></BaseToast>
    ))}
  </>
);

export default Notifications;
