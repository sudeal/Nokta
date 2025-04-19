import React, { useState, useRef } from 'react';
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 100;

const CustomDatePicker = ({ onSelect }) => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear] = useState(new Date().getFullYear());
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const handleConfirm = () => {
    const date = new Date(selectedYear, selectedMonth, selectedDay, selectedHour, selectedMinute);
    onSelect(date);
  };

  return (
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerTitle}>Select Date and Time</Text>
      
      <View style={styles.dateSection}>
        <Text style={styles.sectionTitle}>Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
          {days.map(day => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dateItem,
                selectedDay === day && styles.selectedDateItem
              ]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={[
                styles.dateText,
                selectedDay === day && styles.selectedDateText
              ]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthScroll}>
          {months.map((month, index) => (
            <TouchableOpacity
              key={month}
              style={[
                styles.monthItem,
                selectedMonth === index && styles.selectedMonthItem
              ]}
              onPress={() => setSelectedMonth(index)}
            >
              <Text style={[
                styles.monthText,
                selectedMonth === index && styles.selectedMonthText
              ]}>
                {month}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.timeSection}>
        <Text style={styles.sectionTitle}>Time</Text>
        <View style={styles.timePickerContainer}>
          <ScrollView style={styles.timeScroll}>
            {hours.map(hour => (
              <TouchableOpacity
                key={hour}
                style={[
                  styles.timeItem,
                  selectedHour === hour && styles.selectedTimeItem
                ]}
                onPress={() => setSelectedHour(hour)}
              >
                <Text style={[
                  styles.timeText,
                  selectedHour === hour && styles.selectedTimeText
                ]}>
                  {hour.toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.timeSeparator}>:</Text>
          <ScrollView style={styles.timeScroll}>
            {minutes.map(minute => (
              <TouchableOpacity
                key={minute}
                style={[
                  styles.timeItem,
                  selectedMinute === minute && styles.selectedTimeItem
                ]}
                onPress={() => setSelectedMinute(minute)}
              >
                <Text style={[
                  styles.timeText,
                  selectedMinute === minute && styles.selectedTimeText
                ]}>
                  {minute.toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function BusinessDetailScreen({ route, navigation }) {
  const { business } = route.params;
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  const getBusinessTypeIcon = (type) => {
    if (!type) return "business"; // Default icon if type is undefined
    
    switch (type.toLowerCase()) {
      case "restaurant":
      case "food & beverage":
        return "restaurant";
      case "health care":
      case "doctor":
      case "medical":
        return "medical";
      case "dentist":
        return "medical";
      case "vet":
      case "veterinary":
        return "paw";
      case "barber":
      case "male hair salon":
        return "cut";
      case "hair salon":
      case "female hair salon":
        return "cut";
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

  const handleDateTimeSelect = (dateTime) => {
    setShowDatePicker(false);
    Alert.alert(
      "Appointment Confirmation",
      `Would you like to book an appointment at ${business.name} for ${dateTime.toLocaleString()}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Confirm",
          onPress: () => {
            // Burada randevu API'sine istek atılacak
            Alert.alert(
              "Success!",
              "Your appointment has been booked successfully.",
              [{ text: "OK" }]
            );
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

  return (
    <LinearGradient
      colors={['#1A1A1A', '#2D2D2D']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {business?.name || "Business Details"}
          </Text>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500 }}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF8E8E']}
              style={styles.mainInfoCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.categoryInfo}>
                {business?.category && (
                  <View style={styles.categoryContainer}>
                    <Ionicons 
                      name={getBusinessTypeIcon(business.category)} 
                      size={24} 
                      color="#fff" 
                    />
                    <Text style={styles.categoryText}>{business.category}</Text>
                  </View>
                )}
                {business?.openingHour != null && business?.closingHour != null && (
                  <View style={styles.hoursContainer}>
                    <Ionicons name="time-outline" size={20} color="#fff" />
                    <Text style={styles.hoursText}>
                      {business.openingHour}:00 - {business.closingHour}:00
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
            <Text style={styles.sectionTitle}>About</Text>
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.sectionCard}
            >
              <Text style={styles.description}>
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
            <Text style={styles.sectionTitle}>Location</Text>
            <TouchableOpacity 
              onPress={handleMap}
              disabled={!business?.address}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                style={styles.sectionCard}
              >
                <View style={styles.infoRow}>
                  <Ionicons name="location" size={24} color="#FF6B6B" />
                  <Text style={styles.infoText}>
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
            <Text style={styles.sectionTitle}>Contact</Text>
            <TouchableOpacity 
              onPress={handleCall}
              disabled={!business?.contactNumber}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                style={styles.sectionCard}
              >
                <View style={styles.infoRow}>
                  <Ionicons name="call" size={24} color="#FF6B6B" />
                  <Text style={styles.infoText}>
                    {business?.contactNumber || "Phone number not available"}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>

          <TouchableOpacity
            style={styles.appointmentButton}
            onPress={() => setShowDatePicker(true)}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF8E8E']}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Book Appointment</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>

        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <CustomDatePicker onSelect={handleDateTimeSelect} />
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  mainInfoCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  categoryInfo: {
    gap: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 10,
  },
  categoryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 10,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  description: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  appointmentButton: {
    marginVertical: 20,
    borderRadius: 12,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  pickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  dateSection: {
    marginBottom: 20,
  },
  dateScroll: {
    marginBottom: 10,
  },
  dateItem: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 22.5,
    backgroundColor: '#f0f0f0',
  },
  selectedDateItem: {
    backgroundColor: '#FF6B6B',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDateText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  monthScroll: {
    marginBottom: 10,
  },
  monthItem: {
    paddingHorizontal: 20,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedMonthItem: {
    backgroundColor: '#FF6B6B',
  },
  monthText: {
    fontSize: 16,
    color: '#333',
  },
  selectedMonthText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  timeSection: {
    marginBottom: 20,
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeScroll: {
    height: 120,
  },
  timeItem: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  selectedTimeItem: {
    backgroundColor: '#FF6B6B',
    borderRadius: 20,
  },
  timeText: {
    fontSize: 18,
    color: '#333',
  },
  selectedTimeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 10,
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 