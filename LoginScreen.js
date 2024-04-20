import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image} from "react-native";
import { useState } from "react";
import { StyleSheet } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';



const LoginScreen = ({navigation}) => {


    const [phoneNumber, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [check, seePass] = useState(true);

    const checkPass = () =>{
        seePass(!check);
    }

    const handleLogin = async () => {
        try {
          // Retrieve user data from Realtime Database based on the provided phone number
          const snapshot = await database()
            .ref('Salon/Users')
            .orderByChild('phoneNumber')
            .equalTo(phoneNumber)
            .once('value');
    
          if (snapshot.exists()) {
            const userData = Object.values(snapshot.val())[0];
            const hashedPassword = userData.password;
    
            // Authenticate the user using phone number and password
            await auth().signInWithEmailAndPassword(phoneNumber, hashedPassword);
            console.log('User signed in!');
          } else {
            console.error('User not found.');
          }
        } catch (error) {
          console.error(error.message);
        }
      };

    return(
        <View style={StyleSheet.container}>
                <Image source={require('C://Users//vishn//OneDrive//Desktop//salon//salon//art//lady.png')}
                    style={Styles.img}
                >
                </Image>
                <Text style={Styles.welbck}>
                    Welcome Back,
                </Text>
                <Text style={Styles.welbck2}>
                    Login and grab the best deals.
                </Text>
                <TextInput style={Styles.takePhn} placeholder="Phone number" selectionColor={'#323232'} keyboardType="numeric">
                </TextInput>
                <Image source={require('C://Users//vishn//OneDrive//Desktop//salon//salon//art//phone.png')}
                    style={Styles.phnImg}
                >
                </Image>
                <TextInput style={Styles.takePass} placeholder="Password" selectionColor={'#323232'} secureTextEntry={check}>
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
                <Text style={Styles.forgot}>
                    Forgot Password?
                </Text>
                <TouchableOpacity style={Styles.loginBtn} onPress={handleLogin}>
                    <Text style={Styles.loginTxt}>
                        LOGIN
                    </Text>
                </TouchableOpacity>
                <Text style={Styles.orr}>
                    OR
                </Text>
                <TouchableOpacity style={Styles.googleBtn}>
                    <Image
                    style={Styles.googleImg} source={require('C://Users//vishn//OneDrive//Desktop//salon//salon//art//google.png')}
                    >
                    </Image>
                    <Text style={Styles.googleTxt}>
                        SIGN IN WITH GOOGLE
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={Styles.ask} onPress={()=> navigation.navigate("SignUp")}>
                    <Text style={Styles.askTxt}>
                        Don't have an account? 
                    </Text>
                    <Text style={Styles.signUpBtn}>
                        Sign Up
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
    takePhn: {
        alignSelf: 'center',
        top: hp(10),
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
        top: hp(5.25)
    },
    takePass: {
        alignSelf: 'center',
        top: 70,
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
        top: hp(4)
    },
    seePass: {
        width:30,
        height: 30
    },
    passBtn: {
        position: 'absolute',
        alignSelf:"flex-end",
        top:hp(49.5),
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

export default LoginScreen;