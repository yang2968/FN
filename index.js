/**
 * @format
 */

import React, { useEffect, useState } from 'react';
import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as FN } from './app.json';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);  
});




function HeadlessCheck({ isHeadless }) {

  

  //useWakeLock();


  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
}

AppRegistry.registerComponent(FN, () => HeadlessCheck);
