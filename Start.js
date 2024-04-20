import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import LoginScreen from './LoginScreen';
import { NavigationAction } from '@react-navigation/native';

const StartScreen = ({navigation}) => {

    return(
    <View style={Styles.container}>
        <Image source={require('C://Users//vishn//OneDrive//Desktop//salon//salon//art//Vector.png')}
            style={Styles.vector}
        ></Image>
        <Image
            source={require('C://Users//vishn//OneDrive//Desktop//salon//salon//art//lady.png')}
            style={Styles.lady}
        ></Image>
        <Text style={Styles.srtScrtxt}>
            Book Your Now
        </Text>
        <Text style={Styles.srtScrtxt2}>
            Don't Need To Wait For Your Turn,Book Your{'\n'} Seat in Advance.
        </Text>
        <TouchableOpacity style={Styles.Loginbtn} onPress={()=> navigation.navigate("Login")}>
            <Text style={Styles.LtextBtn}>
                LOGIN
            </Text>
        </TouchableOpacity>
        <TouchableOpacity style={Styles.SignUpbtn} onPress={()=> navigation.navigate("SignUp")}>
            <Text style={Styles.StextBtn}>
                SIGN UP
            </Text>
        </TouchableOpacity>
    </View>);
};

const Styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
        backgroundColor: '#FFB057'
    },
    vector: {
        alignSelf: 'center',
        marginTop: 160,
        width: 180,
        height: 173
    },
    lady: {
        alignSelf: 'center',
        width:160,
        height: 158,
        position: 'absolute',
        top: 180
    },
    srtScrtxt: {
        fontFamily:'LondrinaSolid-Regular',
        fontSize: 40,
        position: 'absolute',
        bottom: 180,
        alignSelf: 'center',
        color: '#323232'
    },
    srtScrtxt2: {
        fontFamily:'Mada-VariableFont_wght',
        fontSize: 18,
        position: 'absolute',
        bottom: 135,
        alignSelf: 'center',
        textAlign: 'center',
        color: '#323232'
    },
    Loginbtn: {
        position: 'absolute',
        bottom: 60,
        left: 30,
        borderRadius: 5,
        borderColor: '#323232',
        borderWidth: 1.5,
        paddingHorizontal: 45,
        paddingVertical: 8
    },
    LtextBtn: {
        fontFamily:'Mada-VariableFont_wght',
        fontSize: 18,
    },
    SignUpbtn: {
        position: 'absolute',
        bottom: 60,
        right: 30,
        borderRadius: 5,
        borderColor: '#323232',
        borderWidth: 1.5,
        paddingHorizontal: 40,
        paddingVertical: 8,
        backgroundColor: '#323232',
    },
    StextBtn: {
        fontFamily:'Mada-VariableFont_wght',
        fontSize: 18,
        color: '#fafafa'
    },
    
});

export default StartScreen;