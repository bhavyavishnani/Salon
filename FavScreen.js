import { View, Text,FlatList, Image, StyleSheet, TouchableOpacity} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { getDatabase } from "firebase/database";
import { database } from "../firebase";
import { onValue, ref} from "firebase/database";
import { useState } from "react";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FavScreen = ()=>  {

    const [data, CheckData] = useState([]);
    const [vendorData, setData] = useState([]);
    const navigation = useNavigation();
    const [userId, setUserId]=useState('');
    console.log(data);

    useEffect(()=>{
        const retrievePhoneNumber = async () => {
            try {
                const phoneNumber = await AsyncStorage.getItem('phoneNumber');
              if (phoneNumber !== null) {
                console.log('Retrieved phone number:', phoneNumber);
                    const dataRef = ref(database, 'Salon/Users/'+phoneNumber+'/Favourites'); // Replace 'your_data_path' with your actual data path
                
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
                        CheckData(dataArray);
                        
                    } else {
                        // Handle the case when there is no data
                        CheckData([]);
                    }
                    });
                
                    // Cleanup the subscription when the component unmounts
                    return () => unsubscribe();
              } else {
                console.log('No phone number stored');
              }
            } catch (error) {
              console.error('Error retrieving phone number:', error);
            }
          };
    
        retrievePhoneNumber(); 
    },[]);

    useEffect(() => {
        if(userId!=''){
        }
        // Reference to your Firebase databas
      }, []);

      useEffect(() => {
        // Check if data has items before fetching and filtering data
        if (data.length > 0) {
          const dataRef = ref(database, 'Salon/Vendors');
        
          const unsubscribe = onValue(dataRef, (snapshot) => {
            const dataSnapshot = snapshot.val();
        
            if (dataSnapshot) {
              // Convert the dataSnapshot to an array of items
              const dataArray = Object.keys(dataSnapshot).map((key) => ({
                id: key,
                ...dataSnapshot[key],
              }));
        
              // Filter the data based on the specific id
              const check = data.map(item => item.id).join(', ');
              const checkArray = check.split(', ');
              // Set data only when filteredData has items
              const filteredData = dataArray.filter(item => checkArray.includes(item.id));
              if (filteredData.length > 0) {
                setData(filteredData);
              } else {
                console.log('filteredData is empty. Not updating data.');
              }
              // Update the state with the filtered data
            } else {
              // Handle the case when there is no data
              setData([]);
            }
          });
      
          return () => unsubscribe();
        }
      }, [data]);
      

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

        const vendorsView = () => {
            navigation.navigate('VenView', {data: dataSend});
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


    if( data.length===0){
        return(

            <View style={{flex:1, backgroundColor: '#fafafa'}}>
                <Image
                    source={require('../art/favBg.png')}
                    style={Styles.bg}
                />
                <Text style={Styles.text}>
                    Your Favourite
                </Text>
                <Text style={Styles.salonTxt}>
                    Salons!!
                </Text>
                <LottieView
                    style={Styles.Gift}
                    source={require('../art/fofav.json')}
                    autoPlay loop
                />
                <Text style={Styles.NoFav}>
                    No Favourties Here {':('}
                </Text>
                <View style={{display: 'flex', flexDirection: 'row', paddingVertical: hp(18.25), paddingHorizontal: wp(5), justifyContent: 'space-between'}}>
                <TouchableOpacity onPress={()=> navigation.navigate('Home')}>
                    <Image
                        source={require('../art/menuUnClicked.png')}
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
                        source={require('../art/fav.png')}
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
    }
    else{
        return(

            <View style={{flex:1, backgroundColor: '#fafafa',}}>
                <Image
                    source={require('../art/favBg.png')}
                    style={Styles.bg}
                />
                <Text style={Styles.text}>
                    Your Favourite
                </Text>
                <Text style={Styles.salonTxt}>
                    Salons!!
                </Text>
                <FlatList
                style={Styles.flatList}
                data={vendorData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}

            />
               <View style={{display: 'flex', flexDirection: 'row', paddingVertical: hp(1), paddingHorizontal: wp(5), justifyContent: 'space-between', }}>
                <TouchableOpacity onPress={()=>navigation.navigate('Home')}>
                    <Image
                        source={require('../art/menuUnClicked.png')}
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
                        source={require('../art/fav.png')}
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
    }

    
};

const Styles = StyleSheet.create({
    Gift: {
        width: wp(60),
        height: hp(25),
        alignSelf: 'center',
        marginTop: '25%'
    },
    NoFav:{
        textAlign: 'center',
        fontFamily:'Mada-VariableFont_wght',
        fontSize: hp(2.5),
        color: '#7c7c7c',
        fontWeight: 'bold'
    },
    bg:{
        width: wp(100),
        height: hp(35)
    },
    text: {
        position: 'absolute',
        paddingVertical: hp(10),
        paddingHorizontal: wp(5),
        fontFamily:'LuckiestGuy-Regular',
        fontSize: hp(3),
        color: '#fafafa'
    },
    salonTxt: {
        position: 'absolute',
        paddingVertical: hp(13.5),
        paddingHorizontal: wp(5),
        fontFamily:'LuckiestGuy-Regular',
        fontSize: hp(3),
        color: '#F1543B'
    },
    item: {
        width: wp(90),
        height: hp(16),
        alignSelf: "center",
        marginTop: hp(1),
        backgroundColor: '#fafafa',
        borderRadius: 15,
        elevation: 4,
        flex: 1,
        marginBottom: hp(1)
      },
    flatList: {
        top: hp(1),
        flex: 1,
        display: 'flex',
        flexDirection: 'column',

        
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

export default FavScreen;