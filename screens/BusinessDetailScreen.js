import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Linking,
  Modal,
  Platform,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { MotiView } from "moti";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 100;

// Category-specific color schemes
const categoryColors = {
  'Health Care': {
    primary: '#4B63DB',
    secondary: '#A682FF',
    gradient: ['#4B63DB', '#8B5CF6', '#A682FF'],
    lightGradient: ['rgba(75, 99, 219, 0.9)', 'rgba(139, 92, 246, 0.9)'],
    cardGradient: ['rgba(75, 99, 219, 0.15)', 'rgba(166, 130, 255, 0.1)'],
    background: '#F0F3FF',
    text: '#2D3748',
    lightText: '#718096',
    accent: '#00B5D8'
  },
  'Food & Beverages': {
    primary: '#FF5722',
    secondary: '#FF8A65',
    gradient: ['#FF5722', '#FF7043', '#FF8A65'],
    lightGradient: ['rgba(255, 87, 34, 0.9)', 'rgba(255, 138, 101, 0.9)'],
    cardGradient: ['rgba(255, 87, 34, 0.15)', 'rgba(255, 138, 101, 0.1)'],
    background: '#FBE9E7',
    text: '#2D3748',
    lightText: '#718096',
    accent: '#FF9800'
  },
  'Personal Care': {
    primary: '#7E22CE',
    secondary: '#A855F7',
    gradient: ['#7E22CE', '#9333EA', '#A855F7'],
    lightGradient: ['rgba(126, 34, 206, 0.9)', 'rgba(168, 85, 247, 0.9)'],
    cardGradient: ['rgba(126, 34, 206, 0.15)', 'rgba(168, 85, 247, 0.1)'],
    background: '#F3E8FF',
    text: '#2D3748',
    lightText: '#718096',
    accent: '#C084FC'
  }
};

// Get colors based on business category
const getColorScheme = (category) => {
  // Default to Food & Beverages if category is not found
  const defaultScheme = categoryColors['Food & Beverages'];
  
  // Check for main categories
  if (categoryColors[category]) {
    return categoryColors[category];
  }
  
  // Check for subcategories
  const lowerCategory = category?.toLowerCase() || '';
  if (lowerCategory.includes('health') || lowerCategory.includes('doctor') || 
      lowerCategory.includes('dental') || lowerCategory.includes('medical') ||
      lowerCategory.includes('saglik') || lowerCategory.includes('sağlık')) {
    return categoryColors['Health Care'];
  }
  if (lowerCategory.includes('restaurant') || lowerCategory.includes('food') || 
      lowerCategory.includes('cafe') || lowerCategory.includes('bar')) {
    return categoryColors['Food & Beverages'];
  }
  if (lowerCategory.includes('hair') || lowerCategory.includes('beauty') || 
      lowerCategory.includes('salon') || lowerCategory.includes('spa') ||
      lowerCategory.includes('personal') || lowerCategory.includes('care') ||
      lowerCategory.includes('coiffure') || lowerCategory.includes('berber')) {
    return categoryColors['Personal Care'];
  }
  
  return defaultScheme;
};

// Helper function to format decimal hours to HH:MM format
const formatHourToTime = (decimalHour) => {
  if (decimalHour === undefined || decimalHour === null) return '';
  
  const hours = Math.floor(decimalHour);
  const minutes = Math.round((decimalHour - hours) * 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Helper function to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
};

const CustomDatePicker = ({ isVisible, onClose, onSelect, colorScheme }) => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);

  const months = [
    { name: 'January', number: 1 },
    { name: 'February', number: 2 },
    { name: 'March', number: 3 },
    { name: 'April', number: 4 },
    { name: 'May', number: 5 },
    { name: 'June', number: 6 },
    { name: 'July', number: 7 },
    { name: 'August', number: 8 },
    { name: 'September', number: 9 },
    { name: 'October', number: 10 },
    { name: 'November', number: 11 },
    { name: 'December', number: 12 }
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const [days, setDays] = useState([]);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  useEffect(() => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    setDays(daysArray);

    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth);
    }
  }, [selectedMonth, selectedYear]);

  const isDateDisabled = (day) => {
    const currentDate = new Date();
    const selectedDate = new Date(selectedYear, selectedMonth, day);
    return selectedDate < new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  };

  const handleConfirm = () => {
    const selectedDate = new Date(selectedYear, selectedMonth, selectedDay, selectedHour, selectedMinute);
    onSelect(selectedDate);
    onClose();
  };

  const formatDayLabel = (day) => {
    const date = new Date(selectedYear, selectedMonth, day);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={[styles.pickerContainer, { backgroundColor: colorScheme.background }]}>
          <View style={styles.headerRow}>
            <Text style={[styles.pickerTitle, { color: colorScheme.primary }]}>Select Date and Time</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="close" size={24} color={colorScheme.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.dateSection}>
            <Text style={[styles.sectionTitle, { color: colorScheme.primary }]}>Month</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthScroll}>
              {months.map((month, index) => (
                <TouchableOpacity
                  key={month.name}
                  style={[
                    styles.monthOption,
                    selectedMonth === index && { backgroundColor: colorScheme.primary }
                  ]}
                  onPress={() => setSelectedMonth(index)}
                >
                  <Text style={[
                    styles.monthText,
                    selectedMonth === index && styles.selectedOptionText
                  ]}>
                    {month.name.substring(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.sectionTitle, { marginTop: 20, color: colorScheme.primary }]}>Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
              {days.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayOption,
                    selectedDay === day && { backgroundColor: colorScheme.primary },
                    isDateDisabled(day) && styles.disabledOption,
                  ]}
                  onPress={() => !isDateDisabled(day) && setSelectedDay(day)}
                  disabled={isDateDisabled(day)}
                >
                  <Text style={[
                    styles.dayLabel,
                    selectedDay === day && styles.selectedOptionText,
                    isDateDisabled(day) && styles.disabledText,
                  ]}>
                    {formatDayLabel(day)}
                  </Text>
                  <Text style={[
                    styles.dayNumber,
                    selectedDay === day && styles.selectedOptionText,
                    isDateDisabled(day) && styles.disabledText,
                  ]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.timeSection}>
            <Text style={[styles.sectionTitle, { color: colorScheme.primary }]}>Time</Text>
            <View style={styles.timePickerContainer}>
              <View style={styles.timeColumn}>
                <Text style={[styles.timeLabel, { color: colorScheme.primary }]}>Hour</Text>
                <ScrollView style={styles.timeScroll} showsVerticalScrollIndicator={false}>
                  {hours.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={[
                        styles.timeOption,
                        selectedHour === hour && { backgroundColor: colorScheme.primary }
                      ]}
                      onPress={() => setSelectedHour(hour)}
                    >
                      <Text style={[
                        styles.timeText,
                        selectedHour === hour && styles.selectedOptionText
                      ]}>
                        {hour.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Text style={[styles.timeSeparator, { color: colorScheme.primary }]}>:</Text>

              <View style={styles.timeColumn}>
                <Text style={[styles.timeLabel, { color: colorScheme.primary }]}>Minute</Text>
                <ScrollView style={styles.timeScroll} showsVerticalScrollIndicator={false}>
                  {minutes.map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      style={[
                        styles.timeOption,
                        selectedMinute === minute && { backgroundColor: colorScheme.primary }
                      ]}
                      onPress={() => setSelectedMinute(minute)}
                    >
                      <Text style={[
                        styles.timeText,
                        selectedMinute === minute && styles.selectedOptionText
                      ]}>
                        {minute.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <LinearGradient
              colors={colorScheme.gradient}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.confirmButtonText}>Confirm Appointment</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default function BusinessDetailScreen({ route, navigation }) {
  const { business } = route.params;
  const colorScheme = getColorScheme(business?.category);
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [HEADER_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT / 2, HEADER_HEIGHT],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT / 2, HEADER_HEIGHT],
    outputRange: [1, 0.8, 0.6],
    extrapolate: "clamp",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState('user123'); // Temporary static userID
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  // Remove AsyncStorage related code and simplify the check
  useEffect(() => {
    if (!userId) {
      Alert.alert(
        "Error",
        "Please login to book an appointment",
        [
          { 
            text: "OK",
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    }
  }, []);

  useEffect(() => {
    if (business?.latitude && business?.longitude) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            setUserLocation({ latitude: userLat, longitude: userLon });
            
            const dist = calculateDistance(
              userLat,
              userLon,
              business.latitude,
              business.longitude
            );
            setDistance(dist);
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      }
    }
  }, [business]);

  const getBusinessTypeIcon = (type) => {
    if (!type) return "business"; // Default icon if type is undefined
    
    const businessType = type.toLowerCase();
    switch (businessType) {
      case "restaurant":
      case "food & beverage":
        return "restaurant";
      case "health care":
      case "doctor":
      case "medical":
        return "local-hospital";
      case "dentist":
        return "local-hospital";
      case "vet":
      case "veterinary":
        return "paw";
      case "barber":
      case "male hair salon":
        return "content-cut";
      case "hair salon":
      case "female hair salon":
        return "content-cut";
      case "nail salon":
      case "nail studio":
        return "hand-left";
      case "tattoo":
      case "piercing":
        return "brush";
      default:
        return "business";
    }
  };

  const handleCall = () => {
    if (business?.contactNumber) {
      Linking.openURL(`tel:${business.contactNumber}`);
    }
  };

  const handleMap = () => {
    if (business?.address) {
      const address = encodeURIComponent(business.address);
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${address}`);
    }
  };

  const createAppointment = async (dateTime) => {
    if (!userId) {
      Alert.alert(
        "Error",
        "Please login to book an appointment",
        [
          { 
            text: "OK",
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
      return;
    }

    try {
      const appointmentData = {
        userID: parseInt(userId),
        businessID: business.businessID,
        appointmentDateTime: dateTime.toISOString(),
        note: "no note attached",
        status: "Pending"
      };

      const response = await fetch('https://nokta-appservice.azurewebsites.net/api/Appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'text/plain'
        },
        body: JSON.stringify(appointmentData)
      });

      if (!response.ok) {
        throw new Error('Appointment creation failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  };

  const handleDateTimeSelect = async (dateTime) => {
    setShowDatePicker(false);
    
    // Seçilen saat iş yeri çalışma saatleri içinde mi kontrol et
    const hour = dateTime.getHours();
    if (hour < business.openingHour || hour > business.closingHour) {
      Alert.alert(
        "Invalid Time",
        "Please select a time within business hours.",
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Appointment Confirmation",
      `Would you like to book an appointment at ${business?.name || ''} for ${dateTime.toLocaleString()}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              await createAppointment(dateTime);
              Alert.alert(
                "Success!",
                "Your appointment has been booked successfully.",
                [{ text: "OK" }]
              );
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to book appointment. Please try again.",
                [{ text: "OK" }]
              );
            }
          }
        }
      ]
    );
  };

  const openAppointmentModal = () => {
    if (Platform.OS === 'ios') {
      setShowModal(true);
    } else {
      setShowDatePicker(true);
    }
  };

  const getFormattedWorkingHours = () => {
    if (business?.openingHour == null || business?.closingHour == null) {
      return 'Working hours not available';
    }
    return `${formatHourToTime(business.openingHour)} - ${formatHourToTime(business.closingHour)}`;
  };

  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  return (
    <LinearGradient
      colors={colorScheme.gradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {business?.name || "Business Details"}
          </Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500 }}
          >
            <LinearGradient
              colors={colorScheme.lightGradient}
              style={[styles.mainInfoCard, { borderRadius: 20 }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.categoryInfo}>
                {business?.category && (
                  <View style={[styles.categoryContainer, { 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  }]}>
                    <Ionicons 
                      name={getBusinessTypeIcon(business.category)} 
                      size={24} 
                      color="#fff" 
                    />
                    <Text style={[styles.categoryText, { fontWeight: '600' }]}>
                      {business.category}
                    </Text>
                  </View>
                )}
                {business?.openingHour != null && business?.closingHour != null && (
                  <View style={[styles.hoursContainer, { 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  }]}>
                    <Ionicons name="time-outline" size={20} color="#fff" />
                    <Text style={[styles.hoursText, { fontWeight: '600' }]}>
                      {getFormattedWorkingHours()}
                    </Text>
                  </View>
                )}
                {distance !== null && (
                  <View style={[styles.distanceContainer, { 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  }]}>
                    <Ionicons name="location-outline" size={20} color="#fff" />
                    <Text style={[styles.distanceText, { fontWeight: '600' }]}>
                      {formatDistance(distance)}
                    </Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500, delay: 200 }}
            style={styles.section}
          >
            <Text style={[styles.sectionTitle, { color: '#fff', fontSize: 20 }]}>About</Text>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.1)']}
              style={[styles.sectionCard, { 
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 20
              }]}
            >
              <Text style={[styles.description, { lineHeight: 24 }]}>
                {business?.description || "No description available"}
              </Text>
            </LinearGradient>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500, delay: 400 }}
            style={styles.section}
          >
            <Text style={[styles.sectionTitle, { color: '#fff', fontSize: 20 }]}>Location</Text>
            <TouchableOpacity onPress={handleMap} disabled={!business?.address}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.1)']}
                style={[styles.sectionCard, {
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 20
                }]}
              >
                <View style={styles.infoRow}>
                  <Ionicons name="location" size={24} color="#fff" />
                  <Text style={[styles.infoText, { marginLeft: 12 }]}>
                    {business?.address || "Address not available"}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500, delay: 600 }}
            style={styles.section}
          >
            <Text style={[styles.sectionTitle, { color: '#fff', fontSize: 20 }]}>Contact</Text>
            <TouchableOpacity onPress={handleCall} disabled={!business?.contactNumber}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.1)']}
                style={[styles.sectionCard, {
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 20
                }]}
              >
                <View style={styles.infoRow}>
                  <Ionicons name="call" size={24} color="#fff" />
                  <Text style={[styles.infoText, { marginLeft: 12 }]}>
                    {business?.contactNumber || "Phone number not available"}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>

          <TouchableOpacity
            style={[styles.appointmentButton, { marginBottom: 30 }]}
            onPress={() => setShowDatePicker(true)}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.2)']}
              style={[styles.gradientButton, {
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: 16
              }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.buttonText, { fontSize: 18, fontWeight: '600' }]}>
                Book Appointment
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>

        <CustomDatePicker
          isVisible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onSelect={handleDateTimeSelect}
          colorScheme={colorScheme}
        />
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  mainInfoCard: {
    padding: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  categoryInfo: {
    gap: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  hoursText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionCard: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  description: {
    color: '#fff',
    fontSize: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  appointmentButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradientButton: {
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    maxHeight: '90%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pickerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  dateSection: {
    marginBottom: 20,
  },
  monthScroll: {
    flexGrow: 0,
  },
  monthOption: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    minWidth: 80,
    alignItems: 'center',
  },
  selectedMonthOption: {
    backgroundColor: '#FF6B6B',
  },
  monthText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  dayScroll: {
    flexGrow: 0,
  },
  dayOption: {
    width: 70,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  selectedDayOption: {
    backgroundColor: '#FF6B6B',
  },
  dayLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
  },
  disabledOption: {
    backgroundColor: '#e0e0e0',
    opacity: 0.7,
  },
  disabledText: {
    color: '#999',
  },
  timeSection: {
    marginTop: 20,
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  timeColumn: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  timeScroll: {
    height: 160,
  },
  timeOption: {
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  selectedTimeOption: {
    backgroundColor: '#FF6B6B',
  },
  timeText: {
    fontSize: 18,
    color: '#333',
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginTop: 30,
    color: '#666',
  },
  confirmButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  distanceText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
}); 