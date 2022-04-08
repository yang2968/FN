import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import PowerManager from '@zeemyself/react-native-powermanager';

class FCMService {
    register = (onRegister, onNotification, onOpenNotification) => {
        this.checkPermission(onRegister);
        this.createNotificationListeners(
            onRegister,
            onNotification,
            onOpenNotification,
        );
    };

    registerAppWithFCM = async () => {
        if (Platform.OS === 'ios') {
            // await messaging().registerDeviceForRemoteMessages();
            await messaging().setAutoInitEnabled(true);
        }
    };

    checkPermission = (onRegister) => {
        messaging()
            .hasPermission()
            .then((enabled) => {
                if (enabled) {
                    //User has permission
                    this.getToken(onRegister);
                } else {
                    //User doesn't have permission
                    this.requestPermission(onRegister);
                }
            })
            .catch((error) => {
                console.log('[FCMService] Permission rejected ', error);
            });
    };

    getToken = (onRegister) => {
        messaging()
            .getToken()
            .then((fcmToken) => {
                if (fcmToken) {
                    onRegister(fcmToken);
                } else {
                    console.log('[FCMService] User does not have a device token');
                }
            })
            .catch((error) => {
                console.log('[FCMService] getToken rejected', error);
            });
    };

    requestPermission = (onRegister) => {
        messaging()
            .requestPermission()
            .then(() => {
                this.getToken(onRegister);
            })
            .catch((error) => {
                console.log('[FCMService] Request Permission rejected', error);
            });
        const channelConfig = {
            channelId: "FN Id",
            channelName: "FN Name"
        };

        messaging().subscribeToTopic("FN");
        const channel = new firebase.notifications.Android.Channel(
            channelConfig.channelId,
            channelConfig.channelName,
            firebase.notifications.Android.Importance.Max
        ).setDescription("FN Channel");
        firebase.notifications().android.createChannel(channel);
        this.requestPermission();
    };

    deleteToken = () => {
        console.log('[FCMService] deleteToken');
        messaging()
            .deleteToken()
            .catch((error) => {
                console.log('[FCMService] Delete token error', error);
            });
    };

    createNotificationListeners = (
        onRegister,
        onNotification,
        onOpenNotification,
    ) => {
        // const channelConfig = {
        //     channelId: "FN Id",
        //     channelName: "FN Name"
        // };
        // messaging().subscribeToTopic("FN");
        // const channel = new firebase.notifications.Android.Channel(
        //     channelConfig.channelId,
        //     channelConfig.channelName,
        //     firebase.notifications.Android.Importance.Max
        // ).setDescription("FN Channel");
        // firebase.notifications().android.createChannel(channel);
        // this.requestPermission();

        //실행중이지만 현재화면은 다른 앱이 실행중이거나 아무것도 실행하지않을때
        messaging().onNotificationOpenedApp((remoteMessage, error) => {
            console.log(
                '[FCMService] onNotificationOpenApp Notification caused app to open from background',
                remoteMessage,
            );
            if (remoteMessage != null || undefined) {

                AsyncStorage.setItem('notifySetting', JSON.stringify({
                    // 알림이 있을 때
                    'notification': 1,
                    // 알림창을 눌러 앱을 접속할 때
                    'openNotification': 1,
                    'usePhoneNow': 1,
                    'inPushNotification': 0
                }));
                AsyncStorage.setItem('notify', JSON.stringify({
                    'content': remoteMessage.notification.body,
                    'service_index': remoteMessage.data.service_index,
                    'isFire': remoteMessage.data.isFire,
                    'image_path': remoteMessage.data.image_path
                }));
                onOpenNotification(remoteMessage);
                //this.removeDeliveredNotification(Notification.NotificationId)
            } else {
                console.log('background notification error', error);
            }
        });

        //Check whether an initial notification is available
        //앱이 실행중이 아닐때
        messaging()
            .getInitialNotification()
            .then((remoteMessage, error) => {
                console.log(
                    '[FCMService] getInitialNotification casued app to open from quit state : fcmremoteMessage :',
                    remoteMessage,
                );

    

                    // 앱이 완전히 종료되어 있을때 메시지가 오는 경우
                    if (remoteMessage != null || undefined) {
                        AsyncStorage.setItem('notifySetting', JSON.stringify({
                            // 알림이 있을 때
                            'notification': 1,
                            // 알림창을 눌러 앱을 접속할 때
                            'openNotification': 0,
                            'usePhoneNow': 0,
                            'inPushNotification': 0
                        }));
                        AsyncStorage.setItem('notify', JSON.stringify({
                            'content': remoteMessage.notification.body,
                            'service_index': remoteMessage.data.service_index,
                            'isFire': remoteMessage.data.isFire,
                            'image_path': remoteMessage.data.image_path
                        }));
                        onOpenNotification(remoteMessage);


                        //this.removeDeliveredNotification(notification.notificationId)
                    } else {
                        console.log('quit state notification error : ', error);
                    }
                });

        //실행중이고 현재 화면일때
        this.messageListener = messaging().onMessage(async (remoteMessage) => {
            console.log('[FCMService] A new FCM message arrived', remoteMessage);

            if (remoteMessage != null || undefined) {
                const getData = await AsyncStorage.getItem('notifySetting', (err, result) => { });
                if (getData != null || undefined) {
                    AsyncStorage.setItem('notifySetting', JSON.stringify({
                        // 알림이 있을 때
                        'notification': 1,
                        // 알림창을 눌러 앱을 접속할 때
                        'openNotification': 1,
                        'usePhoneNow': 0,
                        'inPushNotification': 0
                    }));
                    AsyncStorage.setItem('notify', JSON.stringify({
                        'content': remoteMessage.notification.body,
                        'service_index': remoteMessage.data.service_index,
                        'isFire': remoteMessage.data.isFire,
                        'image_path': remoteMessage.data.image_path
                    }));
                }
            }
        });

        //Triggerd when have new token
        messaging().onTokenRefresh((fcmToken) => {
            console.log('[FCMService] New token refresh :', fcmToken);
            onRegister(fcmToken);
        });
    };

    unRegister = () => {
        this.messageListener();
    };
}

export const fcmService = new FCMService();