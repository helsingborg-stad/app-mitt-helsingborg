import React, { useEffect, createContext } from "react";
import notifee, {
  EventType,
  TimestampTrigger,
  TriggerType,
} from "@notifee/react-native";

interface LocalNotificationType {
  title: string;
  body: string;
  data?: { nextRoute: string };
}

interface ScheduledNotificationType extends LocalNotificationType {
  timestamp: number;
}

export interface NotifeeState {
  showLocalNotification: (options: LocalNotificationType) => Promise<void>;
  ScheduledNotificationType: (
    options: ScheduledNotificationType
  ) => Promise<void>;
}

interface NotifeeProviderInterface {
  navigation: any;
  isSignedIn: boolean;
  children: React.ReactChild | React.ReactChildren;
}

const NotifeeContext = createContext({
  showLocalNotification: (_options: LocalNotificationType) => Promise.resolve(),
  showScheduledNotification: (_options: ScheduledNotificationType) =>
    Promise.resolve(),
});

const NotifeeProvider = (props: NotifeeProviderInterface): JSX.Element => {
  const { navigation, isSignedIn, children } = props;

  useEffect(
    () =>
      notifee.onForegroundEvent(({ type, detail }) => {
        switch (type) {
          case EventType.PRESS:
            if (isSignedIn) {
              const nextRoute = detail.notification?.data?.nextRoute;

              if (nextRoute) {
                navigation.navigate(nextRoute);
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

          if (nextRoute) {
            navigation.navigate(nextRoute);
          }
        }
      };

      void getInitialNotification();
    }
  }, [navigation, isSignedIn]);

  const getChannelId = async () => {
    const channelId = await notifee.createChannel({
      id: "MHdefault",
      name: "MH default Channel",
    });

    return channelId;
  };

  const showLocalNotification = async (options: LocalNotificationType) => {
    const { title, body, data = {} } = options;

    const channelId = await getChannelId();
    await notifee.displayNotification({
      title,
      body,
      data,
      android: {
        channelId,
      },
    });
  };

  const showScheduledNotification = async (
    options: ScheduledNotificationType
  ) => {
    const { title, body, timestamp, data = {} } = options;

    const channelId = await getChannelId();
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp,
    };
    await notifee.createTriggerNotification(
      {
        title,
        body,
        data,
        android: {
          channelId,
          pressAction: {
            launchActivity: "default",
            id: "default",
          },
        },
      },
      trigger
    );
  };

  const value = { showLocalNotification, showScheduledNotification };
  return (
    <NotifeeContext.Provider value={value}>{children}</NotifeeContext.Provider>
  );
};

export default NotifeeContext;
export { NotifeeProvider };
