import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const register = async () => {
    try {
      await axios.post('http://192.168.0.164:3000/register', { username, password });
      setMessage('Registered! Go to login');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Register error');
    }
  };

  return (
    <View>
      <TextInput placeholder="Username" onChangeText={setUsername} value={username} />
      <TextInput placeholder="Password" onChangeText={setPassword} secureTextEntry value={password} />
      <Button title="Register" onPress={register} />
      <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
      {message ? <Text>{message}</Text> : null}
    </View>
  );
}
