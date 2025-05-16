import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function PublicViolationsScreen({ navigation, token }) {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchViolations = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.0.164:3000/violations');
      const data = await response.json();
      setViolations(data);
    } catch (e) {
      Alert.alert('Помилка', 'Не вдалося завантажити порушення');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViolations();
  }, []);

  const markedDates = violations.reduce((acc, violation) => {
    const date = new Date(violation.datetime).toISOString().split('T')[0];
    acc[date] = { marked: true, dotColor: 'red' };
    return acc;
  }, {});

  const filteredViolations = selectedDate
    ? violations.filter((v) => v.datetime.startsWith(selectedDate))
    : [];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>
          Календар правопорушень
        </Text>

        {loading ? (
          <ActivityIndicator />
        ) : (
          <>
            <Calendar
              markedDates={{
                ...markedDates,
                ...(selectedDate && {
                  [selectedDate]: {
                    ...(markedDates[selectedDate] || {}),
                    selected: true,
                    selectedColor: 'blue',
                  },
                }),
              }}
              onDayPress={(day) => setSelectedDate(day.dateString)}
            />

            {selectedDate && (
              <View style={{ marginTop: 16 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                  Порушення за {selectedDate}
                </Text>

                {filteredViolations.length === 0 ? (
                  <Text style={{ marginTop: 8 }}>Немає порушень у цей день.</Text>
                ) : (
                  filteredViolations.map((item) => (
                    <View
                      key={item.id}
                      style={{ marginTop: 12, borderBottomWidth: 1, paddingBottom: 8 }}
                    >
                      <Text>{item.description}</Text>
                      {item.photo && (
                        <Image
                          source={{ uri: `data:image/jpeg;base64,${item.photo}` }}
                          style={{ width: 100, height: 150, marginTop: 8 }}
                        />
                      )}
                      <Text style={{ fontSize: 12, color: 'gray', marginTop: 4 }}>
                        Дата: {new Date(item.datetime).toLocaleString()}
                      </Text>
                      <Text style={{ fontSize: 12, color: 'gray' }}>
                        Геолокація: {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                      </Text>
                    </View>
                  ))
                )}
              </View>
            )}
          </>
        )}

        <View style={{ marginTop: 16, marginBottom: 40 }}>
          <Button title="Увійти" onPress={() => navigation.navigate('Login')} />
            <View style={{ height: 8 }} />
            <Button title="Реєстрація" onPress={() => navigation.navigate('Register')} />
        </View>
      </ScrollView>
    </View>
  );
}
