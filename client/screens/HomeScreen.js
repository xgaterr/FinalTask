import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen({ navigation }) {
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [sending, setSending] = useState(false);
  const [violations, setViolations] = useState([]);
  const [loadingViolations, setLoadingViolations] = useState(true);

  const goToPublic = () => {
    navigation.navigate('PublicViolations');
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Дозвіл', 'Доступ до камери потрібен для фото.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.5, base64: true });
    if (!result.canceled) {
      setPhoto(result);
    }
  };

  const fetchViolations = async () => {
    try {
      setLoadingViolations(true);
      const response = await fetch('http://192.168.0.164:3000/violations');
      const data = await response.json();
      setViolations(data);
    } catch (e) {
      Alert.alert('Помилка', 'Не вдалося завантажити порушення');
    } finally {
      setLoadingViolations(false);
    }
  };

  useEffect(() => {
    fetchViolations();
  }, []);

  const sendViolation = async () => {
    setSending(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Дозвіл', 'Доступ до геолокації потрібен.');
        setSending(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      
      const violation = {
        username: await AsyncStorage.getItem('username'),
        description,
        datetime: new Date().toISOString(),
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        photo: photo ? photo.base64 : null,
      };

      const response = await fetch('http://192.168.0.164:3000/violations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(violation),
      });

      if (response.ok) {
        Alert.alert('Успіх', 'Дані відправлено!');
        setDescription('');
        setPhoto(null);
        fetchViolations();
      } else {
        const resData = await response.json();
        Alert.alert('Помилка', resData.error || 'Не вдалося відправити дані.');
      }
    } catch (e) {
      Alert.alert('Помилка', e.message);
    }
    setSending(false);
  };

  return (
    <View style={{ padding: 16, flex: 1 }}>
      <Text style={{ fontSize: 16, marginBottom: 8 }}>Фіксація правопорушення</Text>
      <Button title="Вийти" onPress={goToPublic} />

      <View style={{ marginVertical: 24 }}>
        <Button title="Зробити фото" onPress={takePhoto} />
        {photo && (
          <Image source={{ uri: photo.uri }} style={{ width: 200, height: 200, marginVertical: 8 }} />
        )}
        <TextInput
          placeholder="Опис"
          value={description}
          onChangeText={setDescription}
          style={{ borderWidth: 1, marginVertical: 8, padding: 8 }}
        />
        <Button
          title={sending ? 'Відправка...' : 'Відправити'}
          onPress={sendViolation}
          disabled={!photo || !description || sending}
        />
        {sending && <ActivityIndicator style={{ marginTop: 8 }} />}
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Список правопорушень</Text>
        {loadingViolations ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={violations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 16, borderBottomWidth: 1, paddingBottom: 8 }}>
                <Text>{item.description}</Text>
                <Text style={{ fontWeight: 'bold', marginTop: 4 }}>Відправник: {item.username}</Text>
                {item.photo && (
                  <Image
                    source={{ uri: `data:image/jpeg;base64,${item.photo}` }}
                    style={{ width: 100, height: 150, marginTop: 8 }}
                  />
                )}
                <Text style={{ fontSize: 12, color: 'gray', marginTop: 4 }}>
                  Дата: {new Date(item.datetime).toLocaleString()}
                </Text>
                <Text style={{ fontSize: 12, color: 'gray', marginTop: 4 }}>
                  Геолокація: {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}
