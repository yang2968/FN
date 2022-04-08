import React, { useEffect, useState, useRef } from 'react';
import { AppState, StyleSheet, View, Button, StatusBar, Platform, PermissionsAndroid } from 'react-native';
import { fcmService } from './src/FCMService';
import { localNotificationService } from './src/LocalNotificationService';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import Stack from "./navigation/Stack";
import API from "./APIs/APIs";

export default function App({ navigation }) {

  useEffect(() => {
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);

    const subscription = AppState.addEventListener("change", nextAppState => {
      // 앱 상태가 백그라운드 상태에서 활성화된 상태로 변경된 경우
      if (appState.current.match(/inactive|background/)) {
        console.log("앱 활성화");

        // 앱 상태가 백그라운드 상태로 변경된 경우
      } else {
        
        console.log("앱 비활성화");
      }

      appState.current = nextAppState;
      //console.log("AppState", appState.current);
    });

    async function requestCameraPermission() {
      try {
        if (Platform.OS === 'ios') {
          Geolocation.requestAuthorization('always');
        }
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          {
            title: "Location Permission",
            message:
              "This App needs access to your Location ",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the Location");
        } else {
          console.log("Location permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    };

    function onRegister(token) {
      requestCameraPermission();
      console.log('[App] onRegister : token :', token);
      // 토큰 설정
      async function setToken() {

        //await AsyncStorage.removeItem('userInfo');
        // AsyncStorage.setItem('userInfo', JSON.stringify({
        //   'token': token,
        //   'userIndex': 41
        // }));

        const getData = await AsyncStorage.getItem('userInfo', (err, result) => { });
        const getToken = JSON.parse(getData);
        console.log("앱 시작 후 가져온 유저 토큰 데이터", getData);
        // 처음 토큰 등록
        if (getData == null || getData == undefined) {
          console.log("First Register");
          AsyncStorage.setItem('notifySetting', JSON.stringify({
            'notification': 0,
            'openNotification': 0,
            'usePhoneNow': 0,
            'inPushNotification': 0
          }));
          Geolocation.getCurrentPosition(
            async (position) => {
              console.log("현재 위치 : ", position);
              const tokenData = await API.setJoin(token, position.coords.latitude, position.coords.longitude);
              console.log("joinResult", tokenData);
              if (tokenData != null || tokenData != undefined) {
                AsyncStorage.setItem('userInfo', JSON.stringify({
                  'token': token,
                  'userIndex': tokenData.user_index
                }));
              }
            },
            (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
          // 토큰 값이 다른 경우
        }
        else if (getToken != undefined && getToken.token != token) {
          console.log("Token Value Is Not Same");

          const userIndex = JSON.parse(getData.userIndex);
          const updateData = await API.setDeviceToken(userIndex, getToken.token);
          console.log("Token Update : ", updateData);

          AsyncStorage.setItem('userInfo', JSON.stringify({
            'token': token,
            'userIndex': tokenData.user_index
          }));

          // 토큰 값이 같은 경우
        } else {
          console.log("Token Value Is Same");
          const getData = await AsyncStorage.getItem('userInfo', (err, result) => { });
          const getData2 = JSON.parse(getData);
          console.log("user_index", getData2.user_index);
          if (getData2.userIndex == null || getData2.userIndex == undefined) {
            Geolocation.getCurrentPosition(
              async (position) => {
                console.log("현재 위치 : ", position);
                const joinData = await API.setJoin(token, position.coords.latitude, position.coords.longitude);
                console.log(joinData);
                if (joinData != null || joinData != undefined) {
                  AsyncStorage.setItem('userInfo', JSON.stringify({
                    'token': token,
                    'userIndex': joinData.user_index
                  }));
                }
              },
              (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
              },
              { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
          }
        }
      }
      setToken();
    }

    function onNotification(notify) {
      console.log('[App] onNotification : notify :', notify);
      const options = {
        soundName: 'default',
        playSound: true,
      };
      localNotificationService.showNotification(
        0,
        notify.title,
        notify,
        notify,
        options,
      );
    }
    // 알림을 열었을 때
    async function onOpenNotification(notify) {
      console.log('[App] onOpenNotification : notify :', notify);

      if (notify == null || notify == undefined || notify == {}) {

          AsyncStorage.setItem('notifySetting', JSON.stringify({
            'notification': 1,
            'openNotification': 1,
            'usePhoneNow': 0,
            'inPushNotification': 0
        }));


        const getData = await AsyncStorage.getItem('notifySetting', (err, result) => { });
        console.log("getData : ", getData);
        if (getData != null || getData != undefined || getData == {}) {
          const notificationData = JSON.parse(getData);
          // 
          if (notificationData.notification == 1 && notificationData.openNotification == 1 && notificationData.usePhoneNow == 1 && notificationData2.inPushNotification == 0) {
            AsyncStorage.setItem('notify', JSON.stringify({
              'content': notify.notification.body,
              'service_index': notify.data.service_index,
              'isFire': notify.data.isFire,
              'image_path': notify.data.image_path
            }));
          }
          else if (notificationData.notification == 0 && notificationData.openNotification == 0 && notificationData.usePhoneNow == 0 && notificationData2.inPushNotification == 0) {
            AsyncStorage.setItem('notify', JSON.stringify({
              'content': notify.notification.body,
              'service_index': notify.data.service_index,
              'isFire': notify.data.isFire,
              'image_path': notify.data.image_path
            }));
          }
        }
      }
    }
    return () => {
      console.log('[App] unRegister');
      fcmService.unRegister();
      localNotificationService.unregister();
      subscription.remove();
    };
  }, []);


  const appState = useRef(AppState.currentState);

  return (
    <>
      <StatusBar barStyle="default" backgroundColor={"#000000"} />
      <NavigationContainer>
        <Stack />
      </NavigationContainer>
    </>
  );
}