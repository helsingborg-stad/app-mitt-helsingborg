/* eslint-disable no-unused-vars */
/**
 * Service for push notification.
 * Component should be added at app top level.
 *
 * Will mostly parse and crate alerts from messages, missing logic will be added.
 * Only tested on iOS.
 */

import React, { Component } from 'react';
import { PushNotificationIOS, Alert } from 'react-native';

class PushNotificationService extends Component {
  componentDidMount() {
    PushNotificationIOS.addEventListener('register', token => {
      // Log device UDID. Unique ID used for sending notification to specific device.
      console.log(token);
    });

    PushNotificationIOS.addEventListener('registrationError', registrationError => {
      console.log(registrationError, '--');
    });

    PushNotificationIOS.addEventListener('notification', function(notification) {
      if (!notification) {
        return;
      }

      const data = notification.getData();
      Alert.alert(JSON.stringify({ data, source: 'CollapsedApp' }));
    });

    PushNotificationIOS.getInitialNotification().then(notification => {
      if (!notification) {
        return;
      }

      const data = notification.getData();
      Alert.alert(JSON.stringify({ data, source: 'ClosedApp' }));
    });

    // Requests user permissions for handling posh notifications.
    PushNotificationIOS.requestPermissions();
  }

  render() {
    return null;
  }
}

export default PushNotificationService;
