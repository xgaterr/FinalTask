import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PublicViolationsScreen from './screens/PublicViolationsScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('token').then(t => {
      if (t) setToken(t);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PublicViolations">
        <Stack.Screen
          name="PublicViolations"
          options={{ title: 'Правопорушення' }}
        >
          {props => (
            <PublicViolationsScreen
              {...props}
              token={token}
              setToken={setToken}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Login" options={{ title: 'Вхід' }}>
          {props => <LoginScreen {...props} setToken={setToken} />}
        </Stack.Screen>
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Реєстрація' }}
        />
        <Stack.Screen name="Home" options={{ title: 'Додати порушення' }}>
          {props => <HomeScreen {...props} setToken={setToken} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
