import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [appointments, setAppointments] = useState({});
  const [loading, setLoading] = useState(true);
  const [businessDetails, setBusinessDetails] = useState({});

  const today = new Date().toISOString().split('T')[0];
  const currentUserId = global.userData?.userID;

  // Randevuları getir
  const fetchAppointments = async () => {
    try {
      const response = await fetch('https://nokta-appservice.azurewebsites.net/api/Appointments');
      const allAppointments = await response.json();
      
      // Sadece giriş yapan kullanıcının randevularını filtrele
      const userAppointments = allAppointments.filter(apt => apt.userID === currentUserId);
      
      // Her randevu için business detaylarını al
      for (let apt of userAppointments) {
        if (!businessDetails[apt.businessID]) {
          const businessResponse = await fetch(`https://nokta-appservice.azurewebsites.net/api/Business/${apt.businessID}`);
          const businessData = await businessResponse.json();
          setBusinessDetails(prev => ({
            ...prev,
            [apt.businessID]: businessData
          }));
        }
      }

      // Randevuları tarihe göre grupla
      const groupedAppointments = userAppointments.reduce((acc, apt) => {
        const date = apt.appointmentDateTime.split('T')[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push({
          id: apt.appointmentID.toString(),
          title: businessDetails[apt.businessID]?.name || 'Yükleniyor...',
          time: apt.appointmentDateTime.split('T')[1].substring(0, 5),
          status: apt.status,
          note: apt.note,
          businessId: apt.businessID
        });
        return acc;
      }, {});

      setAppointments(groupedAppointments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  // O ayki tüm randevuları filtrele
  const currentMonth = today.slice(0, 7);
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

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderAppointment = ({ item }) => (
    <View style={styles.appointment}>
      <Text style={styles.appointmentTitle}>{item.title}</Text>
      <Text style={styles.appointmentTime}>{item.time}</Text>
      <Text style={[styles.appointmentStatus, 
        { color: item.status === 'Accepted' ? '#4CAF50' : '#FFA000' }]}>
        {item.status}
      </Text>
      {item.note && <Text style={styles.appointmentNote}>{item.note}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          ...Object.keys(appointments).reduce((acc, date) => {
            acc[date] = { marked: true, dotColor: '#4CAF50' };
            return acc;
          }, {}),
          [selectedDate]: { selected: true, marked: true, selectedColor: '#2196F3' },
        }}
      />
      <Text style={styles.header}>Seçilen Tarih Randevuları</Text>
      <FlatList
        data={appointments[selectedDate] || []}
        keyExtractor={(item) => item.id}
        renderItem={renderAppointment}
        ListEmptyComponent={
          <Text style={styles.noAppointments}>Seçilen tarihte randevu yok.</Text>
        }
      />
      <Text style={styles.header}>Geçmiş Randevularım</Text>
      <FlatList
        data={pastAppointments}
        keyExtractor={(item) => item.id}
        renderItem={renderAppointment}
        ListEmptyComponent={
          <Text style={styles.noAppointments}>Geçmiş randevunuz yok.</Text>
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginVertical: 8,
    textAlign: 'center',
  },
  appointment: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  appointmentTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  appointmentStatus: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  appointmentNote: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  noAppointments: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
    color: '#999',
  },
});