import React, { useReducer, useContext, useCallback } from "react";
import NotificationView from "../components/molecules/ToastNotification/ToastNotifications";

type Severity = "success" | "info" | "warning" | "error" | undefined;
export interface Notification {
  id: number;
  autoHideDuration: number;
  severity: Severity;
  mainText: string;
  secondaryText: string;
}
const initialState: Notification[] = [];
type ReducerAction =
  | { type: "ADD"; payload: Omit<Notification, "id"> }
  | { type: "REMOVE"; payload: { id: number } }
  | { type: "REMOVE_ALL" };

const notificationReducer = (
  state: Notification[],
  action: ReducerAction
): Notification[] => {
  switch (action.type) {
    case "ADD":
      return [
        ...state,
        {
          id: new Date().valueOf(),
          ...action.payload,
        },
      ];
    case "REMOVE":
      return state.filter((t) => t.id !== action.payload.id);
    case "REMOVE_ALL":
      return initialState;
    default:
      return state;
  }
};

interface Props {
  children: React.ReactNode;
}

type ShowNotificationFunction = (
  mainText: string,
  secondaryText: string,
  severity: Severity,
  autoHideDuration?: number
) => void;

interface NotificationContextType {
  showNotification: ShowNotificationFunction;
  removeNotification: (id: number) => void;
  clearAll: () => void;
}
const defaultVal = {
  showNotification: (_: string, __: string, ___: Severity) => undefined,
  removeNotification: (_: number) => undefined,
  clearAll: () => undefined,
};

const NotificationContext =
  React.createContext<NotificationContextType>(defaultVal);

/** Custom hook that just gives access to the showNotification method, for ease of use.  */
export const useNotification = (): ShowNotificationFunction => {
  const { showNotification } = useContext(NotificationContext);
  return useCallback(showNotification, [showNotification]);
};

export const NotificationProvider: React.FC<Props> = ({ children }: Props) => {
  const [notifications, dispatch] = useReducer(
    notificationReducer,
    initialState
  );

  const showNotification = (
    mainText: string,
    secondaryText: string,
    severity: Severity,
    autoHideDuration = 6000
  ) => {
    dispatch({
      type: "ADD",
      payload: { autoHideDuration, mainText, secondaryText, severity },
    });
  };

  const removeNotification = (id: number) => {
    dispatch({ type: "REMOVE", payload: { id } });
  };
  const clearAll = () => {
    dispatch({ type: "REMOVE_ALL" });
  };
  return (
    <NotificationContext.Provider
      value={{ showNotification, removeNotification, clearAll }}
    >
      <NotificationView
        notifications={notifications}
        removeNotification={removeNotification}
      />
      {children}
    </NotificationContext.Provider>
  );
};
