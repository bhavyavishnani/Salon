import { View, Text,FlatList, Image, StyleSheet, TouchableOpacity} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { getDatabase } from "firebase/database";
import { database } from "../firebase";
import { onValue, ref} from "firebase/database";
import { useState } from "react";
import { useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
    const [data, setData] = useState([]);
    const navigation = useNavigation();
    const[userData, setUserData]=useState(null);
    const [userName, setUsername]=useState();
    const [userId, setUserId]=useState();

    const retrievePhoneNumber = async () => {
        try {
            const phoneNumber = await AsyncStorage.getItem('phoneNumber');
          if (phoneNumber !== null) {
            console.log('Retrieved phone number:', phoneNumber);
            setUserId(phoneNumber);
          } else {
            console.log('No phone number stored');
          }
        } catch (error) {
          console.error('Error retrieving phone number:', error);
        }

      };

    retrievePhoneNumber(); 

    useEffect(()=>{
        const getDataById = (id) => {
            // Reference to your Firebase database
            const dataRef = ref(database, 'Salon/Users'); // Replace 'your_data_path' with your actual data path
             
            // Subscribe to changes in the data
            const unsubscribe = onValue(dataRef, (snapshot) => {
              const dataSnapshot = snapshot.val();
          
              if (dataSnapshot) {
                // Convert the dataSnapshot to an array of items
                const dataArray = Object.keys(dataSnapshot).map((key) => ({
                  id: key,
                  ...dataSnapshot[key],
                }));
          
                // Find the item with the specified ID
                const selectedItem = dataArray.find((item) => item.id === id);
          
                if (selectedItem) {
                  // Process and use the data of the particular ID
                  setUsername(selectedItem.Fullname);
                  
                } else {
                  // Handle the case when the ID is not found
                  console.log('No data found for ID', id);
                }
              } else {
                // Handle the case when there is no data
                console.log('No data available');
              }
            });
          
            // Cleanup the subscription when the component unmounts
            return () => unsubscribe();
          };
          const itemIdToRetrieve = userId; // Replace with the ID you want to retrieve
            getDataById(itemIdToRetrieve);
    },);

    

    useEffect(() => {
        // Reference to your Firebase database
        const dataRef = ref(database, 'Salon/Vendors'); // Replace 'your_data_path' with your actual data path
    
        // Subscribe to changes in the data
        const unsubscribe = onValue(dataRef, (snapshot) => {
          const dataSnapshot = snapshot.val();
    
          if (dataSnapshot) {
            // Convert the dataSnapshot to an array of items
            const dataArray = Object.keys(dataSnapshot).map((key) => ({
              id: key,
              ...dataSnapshot[key],
            }));
    
            // Update the state with the new data
            setData(dataArray);
          } else {
            // Handle the case when there is no data
            setData([]);
          }
        });
    
        // Cleanup the subscription when the component unmounts
        return () => unsubscribe();
      }, []);

      const renderItem = ({ item }) => {

        const roundToHalf = (number) => {
            return Math.round(number * 2) / 2;
        };
        
        let totalReviews = item.TotalReviews*5;
        let totalStars = item.TotalStars;
        let stars = roundToHalf((totalStars/totalReviews)*5);
        const dataSend = {
            id: item.Phone,
            r: stars
            
        };

        const vendorsView = async() => {
            navigation.navigate('VenView', {data: dataSend});
            try {
                await AsyncStorage.setItem('userName', userName);
              } catch (error) {
                console.error('Error storing userName:', error);
              }
        };

        return(
        <TouchableOpacity style={Styles.item} onPress={vendorsView} >
            <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Image
                source={{ uri: item.Image }}
                style={Styles.viewImage}
                onError={(e) => console.log('Image error:', e.nativeEvent.error)}
                onLoad={() => console.log('Image loaded successfully')}
            />
            <View style={{display: 'flex', flexDirection: 'column', flex: 1}}>
            <Text style={Styles.Name}>
                {item.Name}
            </Text>
            <Text style={Styles.Address}>
                {item.Area}
            </Text>
            <View style={{display: 'flex', flexDirection: 'row'}}>
                <Text style={Styles.rating}>{stars.toFixed(1)}</Text>
            <Image
                source={require('../art/star.png')}
                style= {Styles.star}
            />
            </View>
            <View style={Styles.offerView}>
                <Image source={require('../art/offer.png')}
                    style={{width: 20, height: 20}}
                />
                <Text style={Styles.offer}>
                {item.Offers}
            </Text>
            </View>
            
            </View>
            <View style={{display: 'flex', flexDirection: 'column', marginVertical: 15}}>
                <Image source={require('../art/location.png')}
                    style={Styles.location}
                />
                <Text style={Styles.locTxt}>
                    300m
                </Text>
            </View>
            
            </View>
            
        </TouchableOpacity>);
        
    };

    return (
        <View style={Styles.container}>
            <View style={Styles.header}>
                <View style={Styles.title}>
                    <Text style={Styles.hellotxt}>
                        Hello{'\n'}great to have you.
                    </Text>
                    <Text style={Styles.userName}>
                        {userName}
                    </Text>
                </View>
                <Image style={Styles.noti}
                source={require('../art/notifications.png')}
                />
            </View>
            <View style={Styles.cardView}>
                <Text style={{color: '#fafafa', fontSize: hp(2.5), fontWeight: '500', left: wp(5), top: hp(2)}}>
                    Get the best deals{'\n'}and offers
                </Text>
                <View style={Styles.giftBtn}>
                    <TouchableOpacity>
                        <Text style={{color: '#fafafa', backgroundColor: '#FFB057', paddingVertical: hp(1.5), width: wp(35), borderRadius: hp(5), fontSize: hp(2), fontWeight: '700', textAlign: 'center', top: hp(4), left: wp(5)}}>
                            Check Out
                        </Text>
                    </TouchableOpacity>
                    <LottieView
                            style={Styles.Gift}
                            source={require('C://Users//vishn//OneDrive//Desktop//salon//salon//art//gift.json')}
                            autoPlay loop
                        />
                </View>
            </View>
            <Text style={{color: '#1C4A5A', fontSize: 22, fontWeight: '700', top: hp(10), left: wp(5)}}>
                Salons near by you
            </Text>
            <FlatList
                style={Styles.flatList}
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}

            />
            <View style={{display: 'flex', flexDirection: 'row', paddingVertical: hp(1), paddingHorizontal: wp(5), justifyContent: 'space-between'}}>
                <TouchableOpacity>
                    <Image
                        source={require('../art/menu.png')}
                        style={{width: wp(7.5), height: hp(3.5), marginTop: hp(5)}}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image
                        source={require('../art/searchUnClikced.png')}
                        style={{width: wp(8), height: hp(4.5), marginTop: hp(4.5)}}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image
                        source={require('../art/myOrders.png')}
                        style={{width: wp(19), height: hp(9)}}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> navigation.navigate("Fav")}>
                    <Image
                        source={require('../art/favUnClicked.png')}
                        style={{width: wp(7), height: hp(4), marginTop: hp(5)}}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image
                        source={require('../art/profileUnClicked.png')}
                        style={{width: wp(6), height: hp(3), marginTop: hp(5.5)}}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa'
    },
    header: {
        height: "auto",
        display: 'flex',
        flexDirection: "row",
        justifyContent: 'space-between'
    },
    title:{
        marginTop: hp(5),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "flex-start"
    },
    hellotxt: {
        color: '#1C4A5A',
        fontWeight: '600',
        fontSize: hp(2.5),
        marginLeft: wp(3),
    },
    userName: {
        color: '#FFB057',
        fontWeight: '600',
        fontSize: hp(2.5),
        right: wp(28)
    },
    noti:{
        height: hp(4),
        width: wp(5),
        alignSelf: 'flex-end',
        right: wp(3),
        
    },
    cardView: {
        height: hp(18),
        width: wp(90),
        top: hp(5),
        backgroundColor: '#1C4A5A',
        alignSelf: 'center',
        borderRadius: hp(3),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    Gift: {
        width: wp(25),
        height: hp(25),
        bottom: hp(8)
    },
    giftBtn: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    item: {
        width: wp(90),
        height: hp(16),
        alignSelf: "center",
        marginTop: hp(2),
        backgroundColor: '#fafafa',
        borderRadius: 15,
        elevation: 4,
        flex: 1
      },
    flatList: {
        top: hp(12),
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        marginBottom: hp(8),
    },
    viewImage: {
        width: wp(30), height: hp(13), borderRadius: 10, right: 5, marginTop: hp(1.5), marginLeft: wp(4)
    },
    Name: {
        color: '#1B4A5A', fontWeight: '700', fontSize: hp(3), marginLeft: wp(1.5), marginTop: hp(1.5)
    },
    Address: {
        color: '#1b4a5a',marginLeft: wp(1.5), fontSize: hp(2), fontWeight: '600'
    },
    rating: {
        color: '#1B4A5A', fontWeight: '800', marginStart: hp(0.75), fontSize: hp(2.3)
    },
    offer: {
        marginLeft: wp(2), color: '#1b4a5a', fontWeight: '600', fontSize: hp(1.75)
    },
    location: {
        alignSelf: 'center',
        marginTop: hp(3),
        marginRight: wp(5),
        width: wp(4),
        height: hp(3)
    },
    offerView: {marginTop: hp(0.5), marginStart: wp(1.75), flex:1, display: 'flex', flexDirection: 'row'},
    star: {
        height: hp(2.5), width: wp(4), marginTop: hp(0.15), marginLeft: wp(0.5)
    },
    locTxt: {
        color: '#1b4a5a',
        marginRight: wp(2)
    }
});


export default HomeScreen;