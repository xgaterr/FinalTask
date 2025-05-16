import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation, setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async () => {
    try {
      const res = await axios.post('http://192.168.0.164:3000/login', { username, password });

      if (res.status === 200) {
        const token = res.data.token || 'logged';
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('username', username);
        setToken(token);
        navigation.navigate('Home');
      } else {
        setError('Невірна відповідь сервера');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Помилка при вході');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вхід</Text>

      <TextInput
        placeholder="Ім'я користувача"
        onChangeText={setUsername}
        value={username}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Пароль"
        onChangeText={setPassword}
        secureTextEntry
        value={password}
        style={styles.input}
      />

      <View style={styles.buttonContainer}>
        <Button title="Увійти" onPress={login} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Перейти до реєстрації" onPress={() => navigation.navigate('Register')} />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonContainer: {
    marginBottom: 12,
  },
  error: {
    marginTop: 16,
    textAlign: 'center',
    color: 'red',
    fontWeight: '500',
  },
});
