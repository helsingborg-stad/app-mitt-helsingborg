import React, { useEffect, createContext } from "react";
import type { TimestampTrigger } from "@notifee/react-native";
import notifee, {
  EventType,
  TriggerType,
  AndroidImportance,
} from "@notifee/react-native";

import { wait } from "../helpers/Misc";

const INITIAL_RENDERING_PAUSE = 500;

interface NotificationData {
  nextRoute: string;
  params?: Record<string, unknown>;
}

interface LocalNotificationType {
  title: string;
  body: string;
  data?: NotificationData;
}

interface ScheduledNotificationType extends LocalNotificationType {
  timestamp: number;
  id: string;
}

export interface NotifeeState {
  showLocalNotification: (options: LocalNotificationType) => Promise<void>;
  ScheduledNotificationType: (
    options: ScheduledNotificationType
  ) => Promise<void>;
  removeScheduledNotification: (notificationId: string) => Promise<void>;
}

interface NotifeeProviderInterface {
  navigation: any;
  isSignedIn: boolean;
  children: Element | Element[];
}

const NotifeeContext = createContext({
  showLocalNotification: (_options: LocalNotificationType) => Promise.resolve(),
  showScheduledNotification: (_options: ScheduledNotificationType) =>
    Promise.resolve(),
  removeScheduledNotification: (_notificationId: string) => Promise.resolve(),
});

const NotifeeProvider = (props: NotifeeProviderInterface): JSX.Element => {
  const { navigation, isSignedIn, children } = props;

  const tryParseParameters = (parameters: string) => {
    try {
      const parsedParameters = JSON.parse(parameters);
      return parsedParameters;
    } catch (error) {
      console.error("Parsing parameters error: ", error);
      return {};
    }
  };

  const stringifyParameters = (data: NotificationData | undefined) => {
    let notificationData = {};
    if (data !== undefined) {
      notificationData = {
        nextRoute: data.nextRoute,
        ...(data?.params && { params: JSON.stringify(data.params) }),
      };
    }

    return notificationData;
  };

  useEffect(() => {
    const tryRequestPermission = async () => {
      await notifee.requestPermission();
    };

    void tryRequestPermission();
  }, []);

  useEffect(
    () =>
      notifee.onForegroundEvent(({ type, detail }) => {
        switch (type) {
          case EventType.PRESS:
            if (isSignedIn) {
              const nextRoute = detail.notification?.data?.nextRoute;
              let params = detail.notification?.data?.params || undefined;

              if (nextRoute) {
                if (params) {
                  params = tryParseParameters(params);
                }
                navigation.navigate(nextRoute, params);
              }
            }
            break;
          default:
            break;
        }
      }),
    [navigation, isSignedIn]
  );

  useEffect(() => {
    if (isSignedIn) {
      const getInitialNotification = async () => {
        const initial = await notifee.getInitialNotification();
        if (initial) {
          const nextRoute = initial.notification.data?.nextRoute;
          let params = initial.notification?.data?.params;

          if (nextRoute) {
            if (params) {
              params = tryParseParameters(params);
            }

            await wait(INITIAL_RENDERING_PAUSE);
            navigation.navigate(nextRoute, params);
          }
        }
      };

      void getInitialNotification();
    }
  }, [navigation, isSignedIn]);

  const getChannelId = async () => {
    const channelId = await notifee.createChannel({
      id: "MH_default",
      name: "MH default Channel",
      importance: AndroidImportance.HIGH,
    });

    return channelId;
  };

  const showLocalNotification = async (options: LocalNotificationType) => {
    const { title, body, data } = options;

    const notificationData = stringifyParameters(data);

    const channelId = await getChannelId();
    await notifee.displayNotification({
      title,
      body,
      data: notificationData,
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
      },
    });
  };

  const showScheduledNotification = async (
    options: ScheduledNotificationType
  ) => {
    const { title, body, timestamp, id, data } = options;

    const channelId = await getChannelId();
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp,
    };

    const notificationData = stringifyParameters(data);

    await notifee.createTriggerNotification(
      {
        id,
        title,
        body,
        data: notificationData,
        android: {
          channelId,
          pressAction: {
            launchActivity: "default",
            id: "default",
          },
          importance: AndroidImportance.HIGH,
        },
      },
      trigger
    );
  };

  const removeScheduledNotification = async (notificationId: string) => {
    await notifee.cancelTriggerNotification(notificationId);
  };

  const value = {
    showLocalNotification,
    showScheduledNotification,
    removeScheduledNotification,
  };
  return (
    <NotifeeContext.Provider value={value}>{children}</NotifeeContext.Provider>
  );
};

export default NotifeeContext;
export { NotifeeProvider };
