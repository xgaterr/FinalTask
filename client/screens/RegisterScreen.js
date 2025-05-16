import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const register = async () => {
    try {
      await axios.post('http://192.168.0.164:3000/register', { username, password });
      setMessage('✅ Реєстрація успішна! Перейдіть до входу.');
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ Помилка при реєстрації');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Реєстрація</Text>
      
      <TextInput
        placeholder="Ім'я користувача"
        onChangeText={setUsername}
        value={username}
        style={styles.input}
      />
      <TextInput
        placeholder="Пароль"
        onChangeText={setPassword}
        secureTextEntry
        value={password}
        style={styles.input}
      />

      <View style={styles.buttonContainer}>
        <Button title="Зареєструватися" onPress={register} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Перейти до входу" onPress={() => navigation.navigate('Login')} />
      </View>

      {message ? <Text style={styles.message}>{message}</Text> : null}
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
  message: {
    marginTop: 16,
    textAlign: 'center',
    color: '#007bff',
    fontWeight: '500',
  },
});
