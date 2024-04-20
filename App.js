import react from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { AppRegistry } from "react-native";
import { name as appName } from './app.json';
import StartScreen from "./screens/Start";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import SendOtp from "./screens/OtpVerification";
import Checked from "./screens/Checked";
import HomeScreen from "./screens/HomeScreen";
import VendorsView from "./screens/VendorView";
import FavScreen from "./screens/FavScreen";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Review from "./screens/ReviewSubmitScreen";



const stack = createStackNavigator();

const App = () =>{

  const [checkStatus, setStatus] = useState();

  const retrievePhoneNumber = async () => {
    try {
      const storedPhoneNumber = await AsyncStorage.getItem('logStatus');
      if (storedPhoneNumber !== null) {
        console.log('Retrieved phone number:', storedPhoneNumber);
        if(storedPhoneNumber=='OK'){
          setStatus(true);
        }
        
      } else {
        console.log('No phone number stored');
        setStatus(false);
      }
    } catch (error) {
      console.error('Error retrieving phone number:', error);
    }
  };
  retrievePhoneNumber();

  if(checkStatus){
    return(<NavigationContainer>
      <StatusBar translucent></StatusBar>
      <stack.Navigator initialRouteName="Home" screenOptions={{animationEnabled: false}}>
      <stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
        <stack.Screen name="VenView" component={VendorsView} options={{headerShown: false}}/>
        <stack.Screen name="Fav" component={FavScreen} options={{headerShown: false}}/>
        <stack.Screen name="Review" component={Review} options={{headerShown: false}}/>
      </stack.Navigator>
    </NavigationContainer>
    
    );
    
  }else if(checkStatus===false){
    return(
      <NavigationContainer>
        <StatusBar translucent></StatusBar>
        <stack.Navigator initialRouteName="Start">
          <stack.Screen name="Start" component={StartScreen} options={{headerShown: false}}/>
          <stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
          <stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown: false}}/>
          <stack.Screen name="Otp" component={SendOtp} options={{headerShown: false}}/>
          <stack.Screen name="Checked" component={Checked} options={{headerShown: false}}/>
          <stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
          <stack.Screen name="VenView" component={VendorsView} options={{headerShown: false}}/>
          <stack.Screen name="Fav" component={FavScreen} options={{headerShown: false}}/>
        </stack.Navigator>
  
      </NavigationContainer>
    );
  }
};

AppRegistry.registerComponent(appName, ()=>App)

export default App;