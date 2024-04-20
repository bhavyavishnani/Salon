import { View, TouchableOpacity, Text, Image, StyleSheet, FlatList} from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { database } from "../firebase";
import { onValue, ref, set, remove} from "firebase/database";
import { ToastAndroid } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Route, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VendorsView =()=> {
    const route = useRoute();
    const receive = route.params?.data;
    const [vendorData, setVendorData] = useState(null);
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [reviewData, setReviewData] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [Serwidh, setWidth] = useState(1.5);
    const [RevWidth, setRevWidth] = useState(0);
    const [userId, setUserId]=useState();
    const [currentView, setCurrentView] = useState('services');

  useEffect(()=>{
      const retrievePhoneNumber = async () => {
      try {
          const phoneNumber = await AsyncStorage.getItem('phoneNumber');
        if (phoneNumber !== null) {
          setUserId(phoneNumber);
          checkIfIdExists();
        } else {
          //pass
        }
      } catch (error) {
        console.error('Error retrieving phone number:', error);
      }
    };

    retrievePhoneNumber();
  });

   

// Example usage

    const checkIfIdExists = () => {

      const favoritesRef = ref(database, 'Salon/Users/'+userId+'/Favourites');

      // Subscribe to changes in the data
      const unsubscribe = onValue(favoritesRef, (snapshot) => {
        const favoritesData = snapshot.val();
        if (favoritesData && favoritesData[receive.id]) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      }, (error) => {
        console.error('Error fetching data:', error.message);
      });

      // Remember to unsubscribe when you're done listening to changes
      // For example, you can unsubscribe after a certain time or when the component unmounts
      // unsubscribe();
    };
    // Call the function

  

  const handleService = () => {
    setRevWidth(0);
    setWidth(1.5);
    setCurrentView('services');
  }
  const handleReviews = () => {
    setWidth(0);
    setRevWidth(1.5);
    setCurrentView('reviews');
  }

  const submit =()=> {

      const dataSend = {
        ph: receive.id,
      }
       navigation.navigate('Review', {data: dataSend});     
  }

  const handleLike = () => {
    setIsLiked(true);

      set(ref(database, 'Salon/Users/'+userId+'/Favourites/'+receive.id), {
            Phone: receive.id,
      })
    
    .then(()=>{
            //pass
    })
    .catch((error) => {
       ToastAndroid.show('Something Went Wrong..!!');
      });
  };
  
  const handleUnlike = () => {
    setIsLiked(false);
    const refer = ref(database, 'Salon/Users/'+userId+'/Favourites/'+receive.id);
    remove(refer);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Reference to your Firebase database
        const dataRef = ref(database, 'Salon/Vendors/'+receive.id);

        // Subscribe to changes in the data
        const unsubscribe = onValue(dataRef, (snapshot) => {
          const vendorSnapshot = snapshot.val();

          if (vendorSnapshot) {
            // Set the vendor data in state
            setVendorData(vendorSnapshot);
          } else {
            // Handle the case when there is no data
            setVendorData(null);
          }
        });

        // Cleanup the subscription when the component unmounts
        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Reference to your Firebase database
    const dataRef = ref(database, 'Salon/Vendors/'+receive.id+'/Services'); // Replace 'your_data_path' with your actual data path

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

  useEffect(() => {
    // Reference to your Firebase database
    const dataRef = ref(database, 'Salon/Vendors/'+receive.id+'/Reviews'); // Replace 'your_data_path' with your actual data path

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
        setReviewData(dataArray);
      } else {
        // Handle the case when there is no data
        setReviewData([]);
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image
        source={{uri: item.Image}}
        style={styles.cutImage}
      />
      <View style={{marginLeft: 10}}>
        <Text style={styles.itemText}>{item.Name}</Text>
        <View style={{display: 'flex', flexDirection: 'row', marginTop: 5}}>
          <Image
            source={require('../art/timer.png')}
            style={styles.timer}
          />
          <Text style={styles.tame}>
            {item.Time}
          </Text>
        </View>
        <Text style={styles.Price}>
          ₹{item.Price}
        </Text>
      </View>
      <TouchableOpacity style={styles.add}
      >
        <Text style={{color: '#fAFAFA', textAlign: 'center', fontWeight: 'bold', fontSize: 15}}>
          ADD
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderReviewItem = ({ item }) => {

    const StarRating = ({ rating }) => {
      const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= rating; i++) {
          stars.push(
            <Image
              key={i}
              source={require('../art/star.png')}
              style={{ width: 20, height: 20 }}
            />
          );
        }
        return stars;
      };
  
      return <View style={{ flexDirection: 'row', marginTop: 2, marginLeft: 10}}>{renderStars()}</View>;
    };
  
    return (
      <View style={styles.item}>
        <View style={{ marginLeft: 10, display: 'flex', flexDirection: 'column' }}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ color: '#FFB057', fontSize: 18 }}>{item.userName}</Text>
            <View>{/* Invoke the StarRating component with the correct prop */}
              <StarRating rating={item.Stars} />
            </View>
          </View>
          <Text style={styles.stars}>
            {item.userRev}
          </Text>
        </View>
      </View>
    );
  }


    return(
        <View style={{ flex: 1, backgroundColor: '#fafafa', marginTop: 0}}>
          <View style={{width: '100%', height: '10%', zIndex: 1, position: 'absolute', backgroundColor: '#000', opacity: 0.2,}}>

          </View>
          <View style={{width: '100%', height: '6%', zIndex: 1, position: 'absolute', display: 'flex', flexDirection: 'row', marginTop: 30}}>
            <TouchableOpacity style={{display: 'flex', flexDirection: 'row'}} onPress={()=> navigation.goBack()}>
            <Image
              source={require('../art/back.png') }
              style={{width: 30, height: 30, top: 10, marginLeft: 10}}
            />
            <Text style={{color: '#fafafa', fontFamily:'Mada-VariableFont_wght',fontSize: 25, top: 5, marginLeft: 10}}>
              Back
            </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={isLiked ? handleUnlike : handleLike}>
              <Image
                source={isLiked ? require('../art/likeHeart.png') : require('../art/unlikeHeart.png')}
                style={styles.like}
                onError={() => console.log('kuch gadbad')}
              />
            </TouchableOpacity>
          </View>
      {vendorData ? (
        <View style={{zIndex: 0, flex: 1}}>
          <Image
            source={{uri: vendorData.Image}}
            style= {{width: wp(100), height: hp(35), borderBottomLeftRadius: hp(7), zIndex:1, position: 'absolute'}}
          />
          
        <View style={{width: wp(90), height: hp(17.5), backgroundColor: '#fafafa', zIndex: 2, position: 'absolute', alignSelf: 'flex-end', borderTopLeftRadius: hp(5), borderBottomLeftRadius: hp(5), marginTop: hp(25.5), shadowColor: '#000', shadowOpacity: 100, shadowOffset: 10, elevation: 2, display: 'flex', flexDirection: 'column'}}>
         
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
                  <Text style={styles.name}>
                    {vendorData.Name}
                  </Text>
                  <Text style={{color: '#1b4a5a', fontFamily:'Mada-VariableFont_wght', fontSize: hp(1.75), fontWeight: '700', marginLeft: wp(5)}}>
                    {vendorData.Address}
                  </Text>
                  <Text style={{color: '#1b4a5a', fontFamily:'Mada-VariableFont_wght', fontSize: hp(1.75), fontWeight: '700', marginLeft: wp(5)}}>
                    {vendorData.Type}
                  </Text>
      
            </View>
            <View style={{ alignSelf: 'flex-end', marginRight: wp(5), marginBottom: hp(3),}}>
            <View style={{display: 'flex', flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 40, backgroundColor: '#1b4a5a', padding: hp(1), borderRadius: hp(1)}}>
                    <Text style={{color: '#fafafa', fontFamily:'Mada-VariableFont_wght',fontWeight: '700', fontSize: 18}}>
                      {receive.r.toFixed(1)}
                    </Text>
                    <Image
                      source={require('../art/whiteStar.png')}
                      style={{width: wp(4.5), height: hp(2.75),marginLeft: wp(0.5), paddingHorizontal: hp(0)}}
                    />
                  </View>
            </View>           
            
        </View>
        <View style={{width: wp(100), height: hp(1), borderBottomColor: '#ddd', borderBottomWidth: hp(0.1), backgroundColor:'#fafafa'}}></View>
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(7), marginTop: hp(0.75)}}>
        <TouchableOpacity style={{display: 'flex', flexDirection: 'row', paddingHorizontal: hp(1.5), marginRight: wp(2)}}>
          <Image
            source={require('../art/open.png')}
            style={{width: wp(16.5), height: hp(4)}}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{display: 'flex', flexDirection: 'row', alignItems: 'center', borderLeftColor: '#ddd', borderLeftWidth: hp(0.2), paddingHorizontal: hp(1.5), borderRightColor: '#ddd', borderRightWidth: hp(0.2),}}>
          <Image
            source={require('../art/getDirection.png')}
            style={{width: wp(7.5), height: hp(3)}}
          />
          <Text style={{color: '#1b4a5a', fontSize: hp(2.5), fontWeight: '500'}}>
            Location
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: hp(1.5)}}>
          <Image
            source={require('../art/call.png')}
            style={{width: wp(4.5), height: hp(2.25)}}
          />
          <Text style={{color: '#1b4a5a', fontSize: hp(2.5), fontWeight: '500',  marginLeft: wp(1)}}>
            Call
          </Text>
        </TouchableOpacity>
        </View>
        </View>
        <View style={styles.ServiceView}>
          <TouchableOpacity style={{borderBottomColor: '#FFB057',borderBottomWidth: Serwidh, marginLeft: wp(5)}}
            onPress={handleService}
          >
            <Text style={styles.cattxt}>
              Services
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{borderBottomColor: '#FFB057',borderBottomWidth: RevWidth, marginRight: wp(5)}}
            onPress={handleReviews}
          >
            <Text style={styles.Revtxt}>
              Reviews
            </Text>
          </TouchableOpacity>
        </View>
        <View>
        {currentView=='services' &&(
          <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={{}}
        />
        )}
        {currentView=='reviews'&&(
          <View>
            <TouchableOpacity style={{marginLeft: wp(5), marginTop: hp(2), display: 'flex', flexDirection: 'row', alignItems:'center'}}>
              <Text style={{fontSize: hp(2.5), color: '#323232', fontWeight: 'bold'}}>
                See Images
              </Text>
              <Image 
                source={require('../art/go.png')}
                style={{width: wp(3), height: hp(3), marginLeft: wp(1), marginTop: hp(0.5)}}
              />
            </TouchableOpacity>
            {reviewData.length === 0 ? (
              <Text style={{alignSelf: 'center', marginTop: '40%', fontSize: hp(2.25)}}>
                No Reviews Found.!!
            </Text>
            ) : (
              <FlatList
              data={reviewData}
              renderItem={renderReviewItem}
              keyExtractor={(item) => item.id}
              style={{marginBottom: hp(70)}}
            />
            )}
              
              <View style={{marginTop: hp(42), position: 'absolute', marginLeft: wp(5)}}>
                <TouchableOpacity style={{width: wp(90), height: hp(5.5), backgroundColor: '#FFB057', alignSelf: 'center', alignItems: 'center', borderRadius: hp(1.5)}} onPress={submit}>
                  <Text style={{marginTop: hp(1), fontSize: hp(2.5), color: '#fafafa'}}>
                    Write a review
                  </Text>
                </TouchableOpacity>
              </View>
              
          </View>
          
        )}
        </View>
        </View>
      ) : (
        <Text style={{ color: '#000' }}>Vendor data not available.</Text>
      )}
    </View>
    );
};

const styles = StyleSheet.create({
  name: {
    color:'#1b4a5a', marginLeft: wp(4.75), marginTop: hp(1), fontSize: hp(3),fontFamily:'Mada-VariableFont_wght', fontWeight: '700'
  },
  ServiceView: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: hp(45),
    justifyContent: "space-between",
    paddingHorizontal: wp(4)
  
  },
  cattxt: {
    color: '#1b4a5a',
    fontFamily:'Mada-VariableFont_wght',
    fontSize: hp(3),
    fontWeight: '700',
    padding: hp(1),
    marginLeft: hp(0)
  },
  Revtxt: {
    color: '#1b4a5a',
    fontFamily:'Mada-VariableFont_wght',
    fontSize: hp(3),
    fontWeight: '700',
    padding: hp(1)
  },
  item: {
    flex: 1,
    marginTop: hp(2),
    height: hp(12),
    width: wp(90),
    alignSelf: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 8,
    elevation: 2,
    display: 'flex',
    flexDirection: 'row',
    marginBottom: hp(1)
  },
  itemText: {
    color: '#1b4a5a',
    fontSize: hp(2.5),
    fontFamily:'Mada-VariableFont_wght',
    fontWeight: '700',
    marginTop: hp(1),
    
  
  },
  cutImage: {
    width: wp(20),
    height: hp(10),
    borderRadius: hp(1),
    alignSelf:'center',
    marginLeft: wp(2)
  },
  timer: {
    width: wp(5),
    height: hp(2.5),
  },
  tame:{
    color: '#1b4a5a',
    fontFamily:'Mada-VariableFont_wght',
    fontWeight: 'bold',
    fontSize: hp(2)
  },
  Price: {
    color: '#1b4a5a',
    fontWeight: 'bold',
    fontSize: hp(2.25),
    marginLeft: wp(1.25),
    marginTop: hp(0.3)
  },
  add: {
    backgroundColor: '#1b4a5a',
    height: hp(4),
    width: hp(9),
    borderRadius: hp(1.5),
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: hp(5),
    marginLeft: wp(8)
  },
  like: {
    width: wp(8),
    height: hp(3.5),
    marginLeft: hp(30),
    marginTop: hp(1),
  },
  stars: {
    width: wp(90), color: '#1b4a5a', fontSize: 18, display: 'flex', flexDirection: 'row' 
  }
  
});

export default VendorsView;