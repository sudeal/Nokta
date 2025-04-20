import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function CalendarScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [appointments, setAppointments] = useState({});
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split('T')[0];

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://nokta-appservice.azurewebsites.net/api/Appointments');
      const userAppointments = await response.json();

      // Randevuları tarihe göre grupla
      const groupedAppointments = userAppointments.reduce((acc, apt) => {
        const date = apt.appointmentDateTime.split('T')[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push({
          id: apt.appointmentID.toString(),
          businessName: apt.businessName || 'Loading...',
          time: apt.appointmentDateTime.split('T')[1].substring(0, 5),
          status: apt.status,
          category: apt.category || 'Personal Care',
          note: apt.note
        });
        return acc;
      }, {});

      setAppointments(groupedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAppointments();
    });

    return unsubscribe;
  }, [navigation]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getMarkedDates = () => {
    const marked = {};
    Object.keys(appointments).forEach(date => {
      marked[date] = {
        marked: true,
        dotColor: '#7E22CE'
      };
      if (date === selectedDate) {
        marked[date] = {
          ...marked[date],
          selected: true,
          selectedColor: '#7E22CE'
        };
      }
    });
    return marked;
  };

  const renderAppointments = () => {
    if (!selectedDate || !appointments[selectedDate]) {
      return (
        <View style={styles.noAppointments}>
          <Text style={styles.noAppointmentsText}>No appointments for this date</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.appointmentsList}>
        {appointments[selectedDate].map((appointment, index) => (
          <LinearGradient
            key={appointment.id}
            colors={['rgba(126, 34, 206, 0.1)', 'rgba(126, 34, 206, 0.05)']}
            style={styles.appointmentCard}
          >
            <View style={styles.appointmentHeader}>
              <Text style={styles.businessName}>{appointment.businessName}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
                <Text style={styles.statusText}>{appointment.status}</Text>
              </View>
            </View>
            
            <View style={styles.appointmentDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={20} color="#7E22CE" />
                <Text style={styles.detailText}>{appointment.time}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Ionicons name="business-outline" size={20} color="#7E22CE" />
                <Text style={styles.detailText}>{appointment.category}</Text>
              </View>

              {appointment.note && (
                <View style={styles.detailRow}>
                  <Ionicons name="document-text-outline" size={20} color="#7E22CE" />
                  <Text style={styles.detailText}>{appointment.note}</Text>
                </View>
              )}
            </View>
          </LinearGradient>
        ))}
      </ScrollView>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#7E22CE" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={getMarkedDates()}
        theme={{
          todayTextColor: '#7E22CE',
          selectedDayBackgroundColor: '#7E22CE',
          dotColor: '#7E22CE',
          arrowColor: '#7E22CE',
        }}
      />
      <View style={styles.appointmentsContainer}>
        <Text style={styles.sectionTitle}>
          {selectedDate ? `Appointments for ${selectedDate}` : 'Select a date'}
        </Text>
        {renderAppointments()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentsContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  appointmentsList: {
    flex: 1,
  },
  appointmentCard: {
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(126, 34, 206, 0.1)',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  appointmentDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#4B5563',
  },
  noAppointments: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAppointmentsText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});