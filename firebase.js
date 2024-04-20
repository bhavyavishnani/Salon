import { initializeApp,  } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';
import { getAuth, onAuthStateChanged} from 'firebase/auth';
import { firebase } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {

    apiKey: "AIzaSyDssnDIry4_m1jEOL7soGX4qWd4u99wC2A",
  
    authDomain: "salon-350f0.firebaseapp.com",
  
    projectId: "salon-350f0",
  
    storageBucket: "salon-350f0.appspot.com",
  
    messagingSenderId: "520989981282",
  
    appId: "1:520989981282:web:d881880fc5388bcf5b6f3b",
  
    measurementId: "G-6MKM775FHW"

    
  
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
const auth = initializeAuth(app, {persistence: getReactNativePersistence(ReactNativeAsyncStorage)});
auth.setPersistence(getReactNativePersistence(ReactNativeAsyncStorage));

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in, store the user token or necessary data in AsyncStorage
    try {
      await AsyncStorage.setItem('userToken', user.accessToken);
      // You can store other user-related data as needed
    } catch (error) {
      // Handle AsyncStorage error
      console.error('AsyncStorage Error:', error);
    }
  } else {
    // User is signed out, clear any stored tokens or user data from AsyncStorage
    try {
      await AsyncStorage.removeItem('userToken');
      // Remove other stored user-related data if any
    } catch (error) {
      // Handle AsyncStorage error
      console.error('AsyncStorage Error:', error);
    }
  }
});

  
  export { database, ref, push, auth };