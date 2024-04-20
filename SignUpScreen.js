import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ToastAndroid} from "react-native";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { dataRef, push } from '../firebase';
import auth from '@react-native-firebase/auth';


const SignUpScreen = () => {

    const navigation = useNavigation();

    const [fullName, setName] = useState('')
    const [phoneNumber, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [check, seePass] = useState(true);

    

    const checkPass = () =>{
        seePass(!check);
    }

    const handleSetName =(text)=> {
        setName(text);
    }
    const handleSetPhone =(text)=> {
        setPhone(text);
    }
    const handleSetPassword =(text)=> {
        setPassword(text);
    }
    const dataSend ={
        fn: fullName,
        ph: phoneNumber,
        pw: password,
    }

    

    const handleSignUp = async () => {
        if (phoneNumber === '') {
            ToastAndroid.show('Phone Number is required.', ToastAndroid.SHORT);
          } else if (fullName === '') {
            ToastAndroid.show('Full Name is required.', ToastAndroid.SHORT);
          } else if (password === '') {
            ToastAndroid.show('Password is required.', ToastAndroid.SHORT);
          } else {
            if (phoneNumber.length === 10 && password.length >= 8) {
                
                navigation.navigate('Otp', {data: dataSend});

            } else if (phoneNumber.length < 10) {
              ToastAndroid.show('Phone Number should be of 10 numbers', ToastAndroid.SHORT);
            } else if (password.length < 8) {
              ToastAndroid.show('Password is too short.', ToastAndroid.SHORT);
            }
          }
    }
    return(
        <View style={StyleSheet.container}>
                <Image source={require('C://Users//vishn//OneDrive//Desktop//salon//salon//art//lady.png')}
                    style={Styles.img}
                >
                </Image>
                <Text style={Styles.welbck}>
                    Your Details,
                </Text>
                <Text style={Styles.welbck2}>
                    Let's get started with your details.
                </Text>
                <TextInput style={Styles.takeName} placeholder="Full Name" selectionColor={'#323232'} keyboardType="name-phone-pad" value={fullName} onChangeText={handleSetName}>
                </TextInput>
                <Image source={require('C://Users//vishn//OneDrive//Desktop//salon//salon//art//person.png')}
                    style={Styles.prsImg}
                ></Image>
                <TextInput style={Styles.takePhn} placeholder="Phone number" selectionColor={'#323232'} keyboardType="numeric" value={phoneNumber} onChangeText={handleSetPhone}>
                </TextInput>
                <Image source={require('C://Users//vishn//OneDrive//Desktop//salon//salon//art//phone.png')}
                    style={Styles.phnImg}
                >
                </Image>
                <TextInput style={Styles.takePass} placeholder="Password" selectionColor={'#323232'} secureTextEntry={check} value={password} onChangeText={handleSetPassword}>
                </TextInput>
                <Image source={require('C://Users//vishn//OneDrive//Desktop//salon//salon//art//password.png')}
                    style={Styles.passImg}
                >
                </Image>
                <TouchableOpacity style={Styles.passBtn} onPress={checkPass}>
                    <Image
                     style={Styles.seePass} source={require('C://Users//vishn//OneDrive//Desktop//salon//salon//art//eye.png')}
                    >
                    </Image>
                </TouchableOpacity>
                <TouchableOpacity style={Styles.loginBtn} onPress={handleSignUp}>
                    <Text style={Styles.loginTxt}>
                        SIGN UP
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={Styles.ask} onPress={()=> navigation.navigate("Login")}>
                    <Text style={Styles.askTxt}>
                        Already have an account? 
                    </Text>
                    <Text style={Styles.signUpBtn}>
                        Login
                    </Text>
                </TouchableOpacity>
        </View>
    );
};

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: "#fafafa"
    },
    img: {
        width: 160,
        height: hp(20),
        top: 50,
    },
    welbck: {
        fontFamily: 'LondrinaSolid-Regular',
        fontSize: hp(4),
        left: 20,
        top: 50,
        color: '#323232'
    },
    welbck2: {
        fontFamily: 'Mada-VariableFont_wght',
        fontSize: hp(2.75),
        left: 20,
        top: 45,
        color: '#323232'
    },
    takeName: {
        alignSelf: 'center',
        top: hp(10),
        borderRadius: 5,
        borderColor: '#323232',
        borderWidth: 1.5,
        paddingHorizontal: hp(6),
        paddingVertical: 10,
        width: wp(90)
    },
    prsImg: {
        height: hp(4),
        width: wp(5),
        left: wp(9),
        top: hp(4.5)
    },
    takePhn: {
        alignSelf: 'center',
        top: hp(8),
        borderRadius: 5,
        borderColor: '#323232',
        borderWidth: 1.5,
        paddingHorizontal: hp(6),
        paddingVertical: 10,
        width: wp(90)
        

    },
    phnImg: {
        width:hp(2.6),
        height: hp(2.6),
        left: wp(9),
        top: hp(3.25)
    },
    takePass: {
        alignSelf: 'center',
        top: hp(7.5),
        borderRadius: 5,
        borderColor: '#323232',
        borderWidth: 1.5,
        paddingHorizontal: 45,
        paddingVertical: 10,
        width: wp(90)
        

    },
    passImg: {
        width:wp(8),
        height: hp(4.75),
        left:wp(7.5),
        top: hp(1.75)
    },
    seePass: {
        width:30,
        height: 30
    },
    passBtn: {
        position: 'absolute',
        alignSelf:"flex-end",
        top:hp(58.5),
        right: wp(8)
    },
    loginBtn:{
        borderColor: '#323232',
        backgroundColor: '#323232',
        width: wp(90),
        alignSelf: 'center',
        paddingVertical: 10,
        alignItems: "center",
        borderRadius: 5,
        top: hp(13)
    },
    loginTxt:{
        fontFamily: 'Mada-VariableFont_wght',
        color: '#fafafa',
    },
    orr:{
        alignSelf: "center",
        top: hp(15),
        fontSize: hp(2.5),
        color: '#323232'
    },
    googleImg:{
        width: 20,
        height: 20,
        alignItems: 'center',
        right: 10
    },
    googleBtn:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        top: hp(17),
        borderColor: '#323232',
        borderWidth: 1.5,
        width: wp(90),
        paddingVertical:10,
        alignSelf: 'center',
        borderRadius: 5
    },
    googleTxt:{
        fontFamily: "Mada-VariableFont_wght",
        color: '#323232'
    },
    ask: {
        display: 'flex',
        flexDirection: 'row',
        alignSelf: "center",
        top: hp(30)
    },
    askTxt: {
        fontFamily: 'Mada-VariableFont_wght',
        color: '#323232',
        fontSize: 18
    },
    signUpBtn: {
        fontFamily: 'Mada-VariableFont_wght',
        color: 'blue',
        fontSize: 17,
        left: 5,
    },
    forgot: {
        position: "absolute",
        right: wp(6),
        top: hp(58)
    }

});

export default SignUpScreen;