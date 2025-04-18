import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [appointments, setAppointments] = useState({
    '2025-04-18': [{ id: '1', title: 'Doktor Randevusu', time: '10:00' }],
    '2025-04-19': [{ id: '2', title: 'Toplantı', time: '14:00' }],
    '2025-04-15': [{ id: '3', title: 'Dişçi Randevusu', time: '09:00' }],
    '2025-04-22': [{ id: '4', title: 'A Restaurantında Rezervasyon', time: '22:00' }],
    '2025-04-20': [{ id: '5', title: 'Arkadaşlarla Kahvaltı', time: '08:30' }],
    '2025-04-21': [{ id: '6', title: 'Spor Salonu', time: '18:00' }],
  });

  const today = new Date().toISOString().split('T')[0];

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  // O ayki tüm randevuları filtrele
  const currentMonth = today.slice(0, 7); // Örneğin: "2025-04"
  const allAppointmentsThisMonth = Object.keys(appointments)
    .filter((date) => date.startsWith(currentMonth))
    .reduce((acc, date) => {
      acc.push(...appointments[date]);
      return acc;
    }, []);

  const pastAppointments = Object.keys(appointments)
    .filter((date) => date < today)
    .reduce((acc, date) => {
      acc.push(...appointments[date]);
      return acc;
    }, []);

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          ...Object.keys(appointments).reduce((acc, date) => {
            acc[date] = { marked: true };
            return acc;
          }, {}),
          [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
        }}
      />
      <Text style={styles.header}>Randevularım</Text>
      <FlatList
        data={appointments[selectedDate] || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.appointment}>
            <Text style={styles.appointmentTitle}>{item.title}</Text>
            <Text style={styles.appointmentTime}>{item.time}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noAppointments}>Seçilen tarihte randevu yok.</Text>
        }
      />
      <Text style={styles.header}>Geçmiş Randevularım</Text>
      <FlatList
        data={pastAppointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.appointment}>
            <Text style={styles.appointmentTitle}>{item.title}</Text>
            <Text style={styles.appointmentTime}>{item.time}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noAppointments}>Geçmiş randevunuz yok.</Text>
        }
      />
      <Text style={styles.header}>Tüm Randevularım</Text>
      <FlatList
        data={allAppointmentsThisMonth}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.appointment}>
            <Text style={styles.appointmentTitle}>{item.title}</Text>
            <Text style={styles.appointmentTime}>{item.time}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noAppointments}>Bu ay için randevunuz yok.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginVertical: 8,
    textAlign: 'center',
  },
  appointment: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginHorizontal: 5,
  },
  appointmentTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
  },
  appointmentTime: {
    fontSize: 12,
    color: '#666',
  },
  noAppointments: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
    color: '#999',
  },
});