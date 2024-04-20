import { View, TouchableOpacity, Text, Image, StyleSheet, TextInput} from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { database } from "../firebase";
import { onValue, ref, set, remove, update} from "firebase/database";
import { ToastAndroid } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Route, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Review = () => {
    const route = useRoute();
    const receive = route.params?.data;
    const navigation = useNavigation();
    const [vendorData, setVendorData] = useState();
    const [vendorStar, setVendorStar] = useState();
    const [star2, setStar2] = useState(false);
    const [star3, setStar3] = useState(false);
    const [star4, setStar4] = useState(false);
    const [star5, setStar5] = useState(false);
    const [emoji, setEmoji] = useState('😡');
    const [star, setStar]=useState(1);
    const [review, setReview] = useState('');
    const [userName, setUsername]=useState();
    const [userId, setUserId]=useState();

    const retrievePhoneNumber = async () => {
        try {
            const phoneNumber = await AsyncStorage.getItem('phoneNumber');
            const user = await AsyncStorage.getItem('userName');
          if (phoneNumber !== null) {
            setUserId(phoneNumber);
            setUsername(user);
          } else {
            console.log('No phone number stored');
          }
        } catch (error) {
          console.error('Error retrieving phone number:', error);
        }
    
      };
    
    retrievePhoneNumber();

    useEffect(()=>{
        const retrieveTotalReviews = (vendorId) => {
            const nodePath = `Salon/Vendors/${vendorId}/TotalReviews`;
            const starPath = `Salon/Vendors/${vendorId}/TotalStars`;
            onValue(ref(database, nodePath), (snapshot) => {
              const totalReviews = snapshot.val();
              setVendorData(totalReviews);
            }, {
              onlyOnce: true, // Use this option if you only want to fetch the data once
            });
            onValue(ref(database, starPath), (snapshot) => {
                const totalStars = snapshot.val();
                setVendorStar(totalStars);
              }, {
                //onlyOnce: true, // Use this option if you only want to fetch the data once
              });
          };
          
          // Example usage: // Replace with the actual vendor ID
          retrieveTotalReviews(receive.ph);
    })

    const handleStar =()=> {
            setStar2(false);
            setStar3(false);
            setStar4(false);
            setStar5(false);
            setEmoji('😡');
            setStar(1);
    }

    const handleStar2 = ()=> {
        setEmoji('😐');
        if(star2){
            setStar2(false);
            setStar3(false);
            setStar4(false);
            setStar5(false);
            setEmoji('😡');
            setStar(1);
        }
        else{
            setStar2(true);
            setStar(2);
        }
    };
    const handleStar3 = ()=> {
        setEmoji('🙂');
        if(star3){
            setStar3(false);
            setStar4(false);
            setStar5(false);
            setEmoji('😐');
            setStar(2);
            
        }
        else{
            setStar3(true);
            setStar2(true);
            setStar(3);
        }
    };
    const handleStar4 = ()=> {
        setEmoji('😁');
        if(star4){
            setStar4(false);
            setStar5(false);
            setEmoji('🙂');
            setStar(3);
        }
        else{
            setStar4(true);
            setStar3(true);
            setStar2(true);
            setStar(4);
        }
    };
    const handleStar5 = ()=> {
        setEmoji('😍');
        if(star5){
            setStar5(false);
            setEmoji('😁');
            setStar(4);
        }
        else{
            setStar5(true);
            setStar2(true);
            setStar4(true);
            setStar3(true);
            setStar(5);
        }
    };

    const handleReview = (text) => {
        setReview(text);
    }

    const handleSubmit = () => {
        if(review==''){
            ToastAndroid.show('Please write some review', ToastAndroid.SHORT);
        }
        else{

            set(ref(database, 'Salon/Vendors/'+receive.ph+'/Reviews/'+userId), {
                Phone: userId,
                userName: userName,
                Stars: star,
                userRev: review,
            })
            
            .then(()=>{
                    ToastAndroid.show('Review Submitted', ToastAndroid.SHORT);
            })
            .catch((error) => {
            ToastAndroid.show('Something Went Wrong..!!');
            });

            const newData = {
                TotalStars: 0+star,
                TotalReviews: 0+1,
            }


            update(ref(database, 'Salon/Vendors/'+receive.ph), newData)

            .then(() => {
                console.log('Data added to existing ID successfully');
              })
              .catch((error) => {
                console.error('Error adding data to existing ID:', error);
              });
        }
    }


    return(
        <View style={styles.container}>
            <View style={{display: 'flex', flexDirection: 'row', marginTop: '10%', justifyContent: 'center'}}>
                <TouchableOpacity onPress={()=> navigation.goBack()}>
                    <Image
                        source={require('../art/close.png')}
                        style={{width: wp(4.5), height: hp(3.5), right: wp(22), marginTop: hp(0.5)}}
                    />
                </TouchableOpacity>
                <Text style={{fontSize: hp(3), color: '#323232', fontWeight: '500'}}>
                    Rate your visit
                </Text>
            </View>
            <View style={{backgroundColor: '#fff', width: wp(90), height: hp(14), alignSelf: 'center', borderColor: '#cbcbcb', borderWidth: wp(0.2), borderRadius: hp(1.5), marginTop: hp(10)}}>
                <Text style={{fontSize: hp(2.5), color: '#323232', fontWeight: '500', marginLeft: wp(3), marginTop: hp(1)}}>
                    How was your Experience?
                </Text>
                <View style={{display: 'flex', flexDirection: 'row', marginTop: hp(3), marginLeft: wp(3)}}>
                    <TouchableOpacity onPress={handleStar}>
                        <Image
                            source={require('../art/rateStar.png')}
                            style={{width: wp(6.5), height: hp(4), marginRight: wp(2)}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleStar2}>
                        <Image
                            source={star2 ? require('../art/rateStar.png'): require('../art/unRateStar.png')}
                            style={{width: wp(6.5), height: hp(4), marginRight: wp(2)}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleStar3}>
                        <Image
                            source={star3 ? require('../art/rateStar.png'): require('../art/unRateStar.png')}
                            style={{width: wp(6.5), height: hp(4), marginRight: wp(2)}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleStar4}>
                        <Image
                            source={star4 ? require('../art/rateStar.png'): require('../art/unRateStar.png')}
                            style={{width: wp(6.5), height: hp(4), marginRight: wp(2)}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleStar5}>
                        <Image
                            source={star5 ? require('../art/rateStar.png'): require('../art/unRateStar.png')}
                            style={{width: wp(6.5), height: hp(4), marginRight: wp(2)}}
                        />
                    </TouchableOpacity>
                    <Text style={{fontSize: hp(4), marginLeft: wp(30), bottom: hp(0.5), color: '#000'}}>
                        {emoji}
                    </Text>
                </View>
            </View>
            <Text style={{color: '#323232', fontSize: hp(2.5), marginTop: hp(6), marginLeft: hp(3)}}>
                Your feedback
            </Text>
            <View style={{backgroundColor: '#fff', width: wp(90), height: hp(20), alignSelf: 'center', borderColor: '#cbcbcb', borderWidth: wp(0.2), borderRadius: hp(1.5), marginTop: hp(2)}}>
                <TextInput
                    placeholder="Tell us more about your expericence"
                    cursorColor={'#323232'}
                    value={review}
                    multiline={true}
                    onChangeText={handleReview}
                    style={{flex: 1, width: '100%', textAlignVertical: 'top', fontSize: hp(2), paddingHorizontal: wp(2)}}
                />
            </View>
            <Text style={{color: '#323232', fontSize: hp(2.5), marginTop: hp(5), marginLeft: hp(3)}}>
                Optional
            </Text>
            <TouchableOpacity style={{backgroundColor: '#fff', width: wp(90), height: hp(8), alignSelf: 'center', borderColor: '#cbcbcb', borderWidth: wp(0.2), borderRadius: hp(1.5), marginTop: hp(2), display: 'flex', flexDirection: 'row'}}>
                <Image
                    source={require('../art/addImage.png')}
                    style={{width: wp(7), height: hp(3), alignSelf: 'center', marginLeft: wp(5)}}
                />
                <Text style={{color: '#aaa', fontSize: hp(2.5), fontWeight: '600', alignSelf: 'center', marginLeft: hp(1)}}>
                    Add image
                </Text>
            </TouchableOpacity>
            <View style={{marginTop: hp(92), position: 'absolute', marginLeft: wp(5)}}>
                <TouchableOpacity style={{width: wp(90), height: hp(5.5), backgroundColor: '#FFB057', alignSelf: 'center', alignItems: 'center', borderRadius: hp(1.5)}} onPress={handleSubmit}>
                  <Text style={{marginTop: hp(1), fontSize: hp(2.5), color: '#fafafa'}}>
                    Submit review
                  </Text>
                </TouchableOpacity>
              </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa'
    }
});

export default Review;