/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import firebase from '@react-native-firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
const firebaseConfig = {
    apiKey: "AIzaSyDssnDIry4_m1jEOL7soGX4qWd4u99wC2A",
    authDomain: "salon-350f0.firebaseapp.com",
    projectId: "salon-350f0",
    storageBucket: "salon-350f0.appspot.com",
    messagingSenderId: "520989981282",
    appId: "1:520989981282:web:d881880fc5388bcf5b6f3b",
    measurementId: "G-6MKM775FHW",
    databaseURL: "https://salon-350f0-default-rtdb.firebaseio.com/"
  };
  
  async function initializeApp() {
    try {
      if (!firebase.apps.length) {
        await firebase.initializeApp(firebaseConfig);
        console.log('Firebase initialized successfully');
      }
    } catch (error) {
      console.error('Error initializing Firebase', error);
    }
  }
  
  initializeApp(); 

AppRegistry.registerComponent(appName, () => App);
