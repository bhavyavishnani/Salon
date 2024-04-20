import React from "react";
import { useState, useRef, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { View, Text, TextInput, TouchableOpacity, Image} from "react-native";
import LottieView from "lottie-react-native";
import { onValue, ref, remove} from "firebase/database";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { StyleSheet } from "react-native";
import { Route, useRoute } from "@react-navigation/native";
import { ToastAndroid } from "react-native";
import { set } from "firebase/database";
import { database } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const SendOtp = ({ length = 6 }) => {

    const navigation = useNavigation();

    const route = useRoute();
    const receive = route.params?.data;
    const phoneNumber = receive.ph;
    const [confirmation, setConfirmation] = useState(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [otp, setOtp] = useState(new Array(length).fill(''));
    const formattedPhoneNumber = `+91${receive.ph}`;
// Function to trigger OTP verification

const sendoTP = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(formattedPhoneNumber);
      setConfirmation(confirmation);
    } catch (error) {
      console.error(error);
    }
  };

  
  sendoTP();

  const verifyOtp = async () => {
    try {
      const finalOtp = otp.join('');
      const credential = auth.PhoneAuthProvider.credential(confirmation.verificationId, finalOtp);
  
      await auth().signInWithCredential(credential);

      try {
        await AsyncStorage.setItem('phoneNumber', receive.ph);
      } catch (error) {
        console.error('Error storing phone number:', error);
      }

      navigation.navigate("Checked");
      set(ref(database, 'Salon/Users/'+receive.ph), {
        Fullname:receive.fn,
        Phone: receive.ph,
        Password:receive.pw,
        })

        .then(()=>{
                //pass
        })
        .catch((error) => {
        ToastAndroid.show('Something Went Wrong..!!');
        });
            
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('OTP Verification', 'Verification failed. Please try again.');
    }
  };


  /*const writeData = () =>{

      

}*/
        
            
            const inputRefs = useRef([]);

            useEffect(() => {
                inputRefs.current = inputRefs.current.slice(0, length);
            }, [length]);

            const handleChange = (index, value) => {
                const newOtp = [...otp];
                newOtp[index] = value;
                setOtp(newOtp);

                if (value && index < length - 1) {
                inputRefs.current[index + 1]?.focus();
                }
            };

            const handleKeyPress = (index, key) => {
                if (key === 'Backspace' && index > 0 && !otp[index]) {
                inputRefs.current[index - 1].focus();
                }
            };



    return(
        <View style={Styles.container}>
            <Image source={require('C://Users//vishn//OneDrive//Desktop//salon//salon//art//Vectororange.png')}
            style={Styles.backImg}
            >
            </Image>
            <LottieView
            style={Styles.OtpVeri}
            source={require('C://Users//vishn//OneDrive//Desktop//salon//salon//art//otpSent.json')}
            autoPlay loop
            />
            <Text style={Styles.otpTxt}>
                OTP Verification
            </Text>
            <Text style={Styles.numTxt}>
            We have sent an OTP to your number
            </Text>
            <Text style={Styles.numBer}>
                {receive.ph}
            </Text>
            <View style={Styles.otpView}>
            {otp.map((_, index) => (
                <TextInput
                key={index.toString()}
                style={Styles.input}
                value={otp[index]}
                onChangeText={(value) => handleChange(index, value)}
                onKeyPress={({ nativeEvent: { key } }) => handleKeyPress(index, key)}
                keyboardType="numeric"
                maxLength={1}
                ref={(ref) => (inputRefs.current[index] = ref)}
                cursorColor={'#1c4a5a'}
                />
            ))}
            </View>
            
            <TouchableOpacity style={Styles.reOtp}>
                <Text style={{fontFamily: 'Mada-VariableFont_wght', fontSize: hp(2.5), color: '#6B7275'}}>Didn't Recived OTP? </Text>
                <Text style={{fontFamily: 'Mada-VariableFont_wght', fontSize: hp(2.5), color: '#FFB057', fontWeight: 'bold'}}>
                    RESEND OTP
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={Styles.continue} onPress={verifyOtp}>
                <Text style={{color: '#fafafa', alignSelf: 'center', fontFamily: 'Mada-VariableFont_wght', fontSize: hp(2.5)}}>
                    Verify and Procced
                </Text>
            </TouchableOpacity>
            
        </View>
    );
};

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa'
    },
    backImg:{
        width: wp(45),
        height: hp(20),
        top: hp(18),
        alignSelf: 'center'
    },
    OtpVeri: {
        width: wp(30),
        height: hp(20),
        alignSelf: 'center',
        top: hp(-3),
        right: wp(1)
    },
    otpTxt: {
        fontFamily: 'Mada-VariableFont_wght',
        fontSize: hp(4),
        color: '#1C4A5A',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    numTxt: {
        fontFamily: 'Mada-VariableFont_wght',
        textAlign: 'center',
        fontSize: hp(2.5),
        color: '#6B7275'
    },
    numBer: {
        textAlign: 'center',
        fontFamily: 'Mada-VariableFont_wght',
        fontSize: hp(2.5),
        color: '#1C4A5A'
    },
    otpView:{
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'center'
    },
    input: {
    display: 'flex',
    flexDirection: 'row',
    top: 50,
    borderBottomColor: '#1c4a5a',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    width: 40,
    height: 40,
    textAlign: 'center',
    margin: 5,
  },
  reOtp:{
    display: 'flex',
    flexDirection: 'row',
    top: hp(10),
    alignItems: 'center',
    alignSelf: 'center'
  },
  continue: {
    backgroundColor: '#FFB057',
    width: wp(70),
    alignSelf: 'center',
    borderRadius: 10,
    paddingVertical: hp(2),
    top: hp(20)
  }
});

export default SendOtp;