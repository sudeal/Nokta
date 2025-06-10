import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function CalendarScreen({ navigation }) {
  const today = new Date().toISOString().split('T')[0]; // Bugünün tarihi
  const [selectedDate, setSelectedDate] = useState(today); // Başlangıçta bugünü seçili yap
  const [appointments, setAppointments] = useState({});
  const [businessDetails, setBusinessDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [allAppointments, setAllAppointments] = useState([]); // Tüm randevuları saklamak için

  // İşletme detaylarını çeken fonksiyon
  const fetchBusinessDetails = async (businessID) => {
    try {
      const response = await fetch(`https://nokta-appservice.azurewebsites.net/api/Business/${businessID}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching business details for ID ${businessID}:`, error);
      return null;
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      console.log('Starting fetchAppointments...');
      
      // API'den veri çekmeyi dene
      const response = await fetch('https://nokta-appservice.azurewebsites.net/api/Appointments');
      
      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        console.error('API request failed with status:', response.status);
        setAppointments({});
        setAllAppointments([]);
        return;
      }
      
      const allAppointments = await response.json();
      console.log('Raw API response:', typeof allAppointments, allAppointments);
      
      // Response'un array olup olmadığını kontrol et
      if (!allAppointments || !Array.isArray(allAppointments)) {
        console.error('Response is not a valid array:', allAppointments);
        setAppointments({});
        setAllAppointments([]);
        return;
      }
      
      console.log('Total appointments fetched:', allAppointments.length);
      
      // UserID 5 ile filtreleme - güvenli şekilde
      let userAppointments = [];
      try {
        userAppointments = allAppointments.filter(apt => apt && apt.userID === 5) || [];
        console.log('Filtered appointments for user 5:', userAppointments.length);
      } catch (filterError) {
        console.error('Error filtering appointments:', filterError);
        userAppointments = [];
      }

      // Eğer randevu yoksa boş verilerle devam et
      if (userAppointments.length === 0) {
        console.log('No appointments found for user');
        setAppointments({});
        setAllAppointments([]);
        return;
      }

      // İşletme ID'lerini güvenli şekilde topla
      let businessIDs = [];
      try {
        businessIDs = userAppointments
          .filter(apt => apt && apt.businessID) // null/undefined kontrolü
          .map(apt => apt.businessID)
          .filter(id => id); // falsy değerleri filtrele
        console.log('Business IDs found:', businessIDs);
      } catch (mapError) {
        console.error('Error mapping business IDs:', mapError);
        businessIDs = [];
      }
      
      const uniqueBusinessIDs = [...new Set(businessIDs)];

      // İşletme detaylarını çekelim
      const businessDetailsMap = {};
      for (const id of uniqueBusinessIDs) {
        const details = await fetchBusinessDetails(id);
        if (details) {
          businessDetailsMap[id] = details;
        }
      }
      
      // İşletme detaylarını saklayalım
      setBusinessDetails(businessDetailsMap);

      // Randevuları tarihe göre grupla - güvenli şekilde
      let groupedAppointments = {};
      try {
        groupedAppointments = userAppointments.reduce((acc, apt) => {
          // Appointment'ın gerekli alanları olduğundan emin ol
          if (!apt || !apt.appointmentDateTime || !apt.appointmentID) {
            console.warn('Invalid appointment data:', apt);
            return acc;
          }
          
          const date = apt.appointmentDateTime.split('T')[0];
          if (!acc[date]) {
            acc[date] = [];
          }
          
          // İşletme adını işletme detaylarından alalım
          const business = businessDetailsMap[apt.businessID];
          const businessName = business ? business.name : `Business #${apt.businessID}`;
          
          acc[date].push({
            id: apt.appointmentID.toString(),
            businessID: apt.businessID,
            businessName: businessName,
            time: apt.appointmentDateTime.split('T')[1].substring(0, 5),
            status: apt.status || 'Pending',
            category: business?.category || 'Unknown',
            address: business?.address || 'Address not available',
            note: apt.note || ''
          });
          return acc;
        }, {});
        console.log('Grouped appointments:', Object.keys(groupedAppointments).length, 'dates');
      } catch (reduceError) {
        console.error('Error grouping appointments:', reduceError);
        groupedAppointments = {};
      }

      setAppointments(groupedAppointments);
      setAllAppointments(userAppointments);
    } catch (error) {
      console.error("Error in fetchAppointments:", error);
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

  // Randevu iptal etme işlemi
  const cancelAppointment = async (appointmentId, businessName) => {
    Alert.alert(
      "Cancel Appointment",
      `Are you sure you want to cancel your appointment at ${businessName}?`,
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              
              // API çağrısı ile randevuyu iptal et
              console.log('Cancelling appointment with ID:', appointmentId);
              console.log('API URL:', `https://nokta-appservice.azurewebsites.net/api/Appointments/${appointmentId}`);
              
              const response = await fetch(`https://nokta-appservice.azurewebsites.net/api/Appointments/${appointmentId}`, {
                method: 'DELETE',
                headers: {
                  'accept': '*/*'
                },
              });

              console.log('Response status:', response.status);
              console.log('Response ok:', response.ok);

              if (response.ok) {
                Alert.alert(
                  "Success",
                  "Your appointment has been cancelled successfully.",
                  [{ 
                    text: "OK",
                    onPress: () => {
                      // Randevuları yeniden yükle
                      fetchAppointments();
                    }
                  }]
                );
              } else {
                const errorText = await response.text();
                console.error('Cancel appointment error - Status:', response.status);
                console.error('Cancel appointment error - Response:', errorText);
                
                Alert.alert(
                  "Error",
                  `Failed to cancel appointment. Status: ${response.status}\nError: ${errorText}`,
                  [{ text: "OK" }]
                );
              }
            } catch (error) {
              console.error('Error cancelling appointment:', error);
              Alert.alert(
                "Error",
                "An error occurred while cancelling the appointment.",
                [{ text: "OK" }]
              );
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // Tarih seçme işlemi
  const handleDayPress = (day) => {
    // Eğer zaten seçili olan tarihe tekrar tıklanırsa, seçimi kaldır
    if (day.dateString === selectedDate) {
      setSelectedDate(''); // Seçili tarihi temizle
    } else {
      setSelectedDate(day.dateString); // Yeni bir tarih seç
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'accepted':
        return '#50E0FF';
      case 'pending':
        return '#FFC107';
      case 'cancelled':
      case 'rejected':
        return '#FF6B6B';
      default:
        return '#4CC9F0';
    }
  };

  const getMarkedDates = () => {
    const marked = {};
    Object.keys(appointments).forEach(date => {
      marked[date] = {
        marked: true,
        dotColor: '#4CC9F0'
      };
      if (date === selectedDate) {
        marked[date] = {
          ...marked[date],
          selected: true,
          selectedColor: '#1C2541'
        };
      }
    });
    return marked;
  };

  const renderAppointments = () => {
    if (!selectedDate || !appointments[selectedDate] || appointments[selectedDate].length === 0) {
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
            colors={['rgba(76, 201, 240, 0.2)', 'rgba(76, 201, 240, 0.1)']}
            style={styles.appointmentCard}
          >
            <View style={styles.appointmentHeader}>
              <Text style={styles.businessName} numberOfLines={1} ellipsizeMode="tail">
                {appointment.businessName}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
                <Text style={styles.statusText}>{appointment.status}</Text>
              </View>
            </View>
            
            <View style={styles.appointmentDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={20} color="#4CC9F0" />
                <Text style={styles.detailText}>{appointment.time}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Ionicons name="business-outline" size={20} color="#4CC9F0" />
                <Text style={styles.detailText}>{appointment.category}</Text>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={20} color="#4CC9F0" />
                <Text style={styles.detailText} numberOfLines={1} ellipsizeMode="tail">
                  {appointment.address}
                </Text>
              </View>

              {appointment.note && (
                <View style={styles.detailRow}>
                  <Ionicons name="document-text-outline" size={20} color="#4CC9F0" />
                  <Text style={styles.detailText}>{appointment.note}</Text>
                </View>
              )}
            </View>

            {/* İptal butonu - sadece pending veya confirmed randevular için */}
            {(appointment.status?.toLowerCase() === 'pending' || appointment.status?.toLowerCase() === 'confirmed') && (
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => cancelAppointment(appointment.id, appointment.businessName)}
              >
                <Ionicons name="close-circle-outline" size={20} color="#FF6B6B" />
                <Text style={styles.cancelButtonText}>Cancel Appointment</Text>
              </TouchableOpacity>
            )}
          </LinearGradient>
        ))}
      </ScrollView>
    );
  };

  // Tüm randevuları gösterecek fonksiyon
  const renderAllAppointments = () => {
    // Tüm randevu tarihlerini sırala ve organize et
    const allAppointmentsByDate = Object.keys(appointments)
      .sort((a, b) => new Date(a) - new Date(b)) // Tarihleri sırala
      .reduce((result, date) => {
        if (appointments[date] && appointments[date].length > 0) {
          result.push({
            date,
            appointments: appointments[date]
          });
        }
        return result;
      }, []);

    if (allAppointmentsByDate.length === 0) {
      return (
        <View style={styles.noAppointments}>
          <Text style={styles.noAppointmentsText}>No appointments found</Text>
        </View>
      );
    }

    // Tarih formatını düzenleyen fonksiyon
    const formatDate = (dateString) => {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
      <ScrollView style={styles.appointmentsList}>
        {allAppointmentsByDate.map((dateGroup) => (
          <View key={dateGroup.date} style={styles.dateGroup}>
            <Text style={styles.dateHeader}>{formatDate(dateGroup.date)}</Text>
            
            {dateGroup.appointments.map((appointment, index) => (
              <LinearGradient
                key={appointment.id}
                colors={['rgba(76, 201, 240, 0.2)', 'rgba(76, 201, 240, 0.1)']}
                style={styles.appointmentCard}
              >
                <View style={styles.appointmentHeader}>
                  <Text style={styles.businessName} numberOfLines={1} ellipsizeMode="tail">
                    {appointment.businessName}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
                    <Text style={styles.statusText}>{appointment.status}</Text>
                  </View>
                </View>
                
                <View style={styles.appointmentDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={20} color="#4CC9F0" />
                    <Text style={styles.detailText}>{appointment.time}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="business-outline" size={20} color="#4CC9F0" />
                    <Text style={styles.detailText}>{appointment.category}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={20} color="#4CC9F0" />
                    <Text style={styles.detailText} numberOfLines={1} ellipsizeMode="tail">
                      {appointment.address}
                    </Text>
                  </View>

                  {appointment.note && (
                    <View style={styles.detailRow}>
                      <Ionicons name="document-text-outline" size={20} color="#4CC9F0" />
                      <Text style={styles.detailText}>{appointment.note}</Text>
                    </View>
                  )}
                </View>

                {/* İptal butonu - sadece pending veya confirmed randevular için */}
                {(appointment.status?.toLowerCase() === 'pending' || appointment.status?.toLowerCase() === 'confirmed') && (
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => cancelAppointment(appointment.id, appointment.businessName)}
                  >
                    <Ionicons name="close-circle-outline" size={20} color="#FF6B6B" />
                    <Text style={styles.cancelButtonText}>Cancel Appointment</Text>
                  </TouchableOpacity>
                )}
              </LinearGradient>
            ))}
          </View>
        ))}
      </ScrollView>
    );
  };

  if (loading) {
    return (
      <LinearGradient 
        colors={["#0A1128", "#1C2541"]} 
        style={[styles.container, styles.centered]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ActivityIndicator size="large" color="#4CC9F0" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient 
      colors={["#0A1128", "#1C2541"]} 
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={getMarkedDates()}
            current={today}
            theme={{
              calendarBackground: '#0F1C2E',
              monthTextColor: '#FFFFFF',
              textSectionTitleColor: '#4CC9F0',
              selectedDayBackgroundColor: '#4CC9F0',
              selectedDayTextColor: '#FFFFFF',
              todayTextColor: '#50E0FF',
              dayTextColor: '#FFFFFF',
              textDisabledColor: '#3A506B',
              dotColor: '#4CC9F0',
              arrowColor: '#4CC9F0',
              indicatorColor: '#4CC9F0',
              textDayFontWeight: '400',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '600',
            }}
          />
        </View>

        <View style={styles.appointmentsContainer}>
          <Text style={styles.sectionTitle}>
            {selectedDate 
              ? `Appointments for ${selectedDate}` 
              : 'All Appointments'}
          </Text>
          
          {selectedDate && appointments[selectedDate] && appointments[selectedDate].length > 0
            ? renderAppointments() 
            : renderAllAppointments()}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: 10,
  },
  calendarContainer: {
    height: 350,
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
    color: '#FFFFFF',
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
    borderColor: 'rgba(76, 201, 240, 0.2)',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  businessName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    flex: 1,
    marginRight: 10,
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
    color: 'rgba(255, 255, 255, 0.8)',
  },
  noAppointments: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAppointmentsText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  dateGroup: {
    marginBottom: 16,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  cancelButtonText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});