import LottieView from "lottie-react-native";
import { View,TouchableOpacity, Text } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Checked = () => {

    const logStatus = async () => {
      const status = 'OK';
        try {
          await AsyncStorage.setItem('logStatus', status);
          console.log('Phone number stored successfully');
        } catch (error) {
          console.error('Error storing phone number:', error);
        }
      };

      logStatus();

    const navigation = useNavigation();

    return(
        <View style={styles.container}>
            <LottieView
            style={styles.check}
            source={require('../art/otpSent.json')}
            autoPlay loop
            />
            <Text style={{alignSelf: 'center', fontSize: hp(3), top: hp(18), textAlign: 'center', color: '#1c4a5a', fontWeight: 'bold'}}>
                Your account has been verified{'\n'}successfully!!
            </Text>
            <TouchableOpacity style={styles.done} onPress={()=>navigation.navigate("Home")}>
                <Text style={{fontSize: hp(2.5), alignSelf: 'center', color: '#fafafa'}}>
                    Done
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    check:{
        width: wp(60),
        alignSelf: 'center',
        top: hp(10)
    },
    done: {
        backgroundColor: '#FFB057',
        width: wp(60),
        alignSelf: 'center',
        paddingVertical: hp(2),
        borderRadius: 10,
        top: hp(40)
    }
});



export default Checked;