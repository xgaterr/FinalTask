import React from 'react';
import { View, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ setToken }) {
  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
  };

  return (
    <View>
      <Text>Welcome! You're logged in.</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
