import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

class LocalNotificationService {
  configure = (onOpenNotification) => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log(
          '[LocalNotificationService] onRegister : localtoken',
          token,
        );
      },
      onNotification: async function (notification) {
        console.log('[LocalNotificationService] onNotification ', notification);

        // 앱 아이콘을 눌러 들어와 알림을 누른 경우
         const getData = await AsyncStorage.getItem('notifySetting', (err, result) => { });
         console.log(getData);
        // console.log(getData);
        if(getData != null || undefined || {}) {
          const notificationData = JSON.parse(getData);
          if(notificationData.notification == 0 && notificationData.openNotification == 0 && notificationData.usePhoneNow == 0 && notificationData.inPushNotification == 0) {

            AsyncStorage.setItem('notifySetting', JSON.stringify({
              // 알림이 있을 때
              'notification': 1,
              // 알림창을 눌러 앱을 접속할 때
              'openNotification': 1,
              // 폰 사용하고 있는 경우
              'usePhoneNow': 1,
              'inPushNotification': 0
            }));
          } else if(notificationData.notification == 1 && notificationData.openNotification == 1 && notificationData.usePhoneNow == 1 && notificationData.inPushNotification == 0) {

            AsyncStorage.setItem('notifySetting', JSON.stringify({
              // 알림이 있을 때
              'notification': 1,
              // 알림창을 눌러 앱을 접속할 때
              'openNotification': 1,
              // 폰 사용하고 있는 경우
              'usePhoneNow': 1,
              'inPushNotification': 0
            }));
          }
  
        }

        //Only call callback if not from foreground
        if (Platform.OS === 'ios') {
          // (required) Called when a remote is received or opened, or local notification is opened
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  };

  unRegister = () => {
    PushNotification.unregister();
  };

  showNotification = (id, title, message, data = {}, options = {}) => {
    PushNotification.localNotification({
      // Android only Properties
      ...this.buildAndroidNotification(id, title, message, data, options),
      // IOS and Android properties
      ...this.buildIOSNotification(id, title, message, data, options),
      // IOS and Android properties
      title: title || '',
      message: message || '',
      playSound: options.playSound || false,
      soundName: options.soundName || 'default',
      userInteraction: false, //BOOLEAN : If the notification was opend by the user from notification area or not
    });
  };

  buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
    return {
      id: id,
      authCancel: true,
      largeIcon: options.largeIcon || 'ic_launcher',
      smallIcon: options.smallIcon || 'ic_notification',
      bigText: message || '',
      subText: title || '',
      vibrate: options.vibrate || true,
      vibration: options.vibration || 300,
      priority: options.priority || 'high',
      importance: options.importance || 'high', // (optional) set notification importance, default : ??~
      data: data,
    };
  };

  buildIOSNotification = (id, title, message, data = {}, options = {}) => {
    return {
      alertAction: options.alertAction || 'view',
      category: options.category || '',
      userInfo: {
        id: id,
        item: data,
      },
    };
  };

  cancelAllLocalNotifications = () => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeAllDeliveredNotifications();
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
  };

  removeDeliveredNotificationByID = (notification) => {
    console.log(
      '[LocalNotificationService] removeDeliveredNotificationByID:',
      notification,
    );
    PushNotification.cancelLocalNotifications({ id: `${notificationId}` });
  };
}

export const localNotificationService = new LocalNotificationService();