import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import auth, { firebase } from '@react-native-firebase/auth';

const App: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmation, setConfirmation] = useState<any>(null);

  firebase.initializeApp;

  const sendOtp = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirmation(confirmation);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmOtp = async () => {
    try {
      await confirmation.confirm(verificationCode);
      Alert.alert('Success', 'Phone number verified successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Invalid verification code. Please try again.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Enter Phone Number:</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, width: 200 }}
        placeholder="Phone Number"
        onChangeText={(text) => setPhoneNumber(text)}
      />
      <Button title="Send OTP" onPress={sendOtp} />

      {confirmation && (
        <>
          <Text>Enter Verification Code:</Text>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, width: 200 }}
            placeholder="Verification Code"
            onChangeText={(text) => setVerificationCode(text)}
          />
          <Button title="Confirm OTP" onPress={confirmOtp} />
        </>
      )}
    </View>
  );
};

export default App;
