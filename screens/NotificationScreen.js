import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLanguage } from '../context/LanguageContext';

export default function NotificationScreen() {
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('https://nokta-appservice.azurewebsites.net/api/Appointments');
      const appointments = await response.json();
      
      const currentUserID = global.userData?.userID || 5;
      
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const relevantAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.appointmentDateTime);
        const isToday = aptDate.toDateString() === today.toDateString();
        const isTomorrow = aptDate.toDateString() === tomorrow.toDateString();
        return apt.userID === currentUserID && (isToday || isTomorrow);
      });

      // Update the notification messages and text content
      const notificationItems = relevantAppointments.map(apt => {
        const aptDate = new Date(apt.appointmentDateTime);
        const isToday = aptDate.toDateString() === today.toDateString();
        
        let notificationType;
        let messages = [];
        let icon;
        
        // Add acceptance message if appointment is accepted
        if (apt.status === "Accepted") {
          messages.push(language.notificationAppointmentConfirmed);
          notificationType = "success";
          icon = "checkmark-circle";
        }

        // Add time remaining message
        if (isToday) {
          messages.push(language.notificationAppointmentToday);
        } else {
          messages.push(language.notificationOneDayUntil);
        }

        // If not already set by acceptance, set type based on timing
        if (!notificationType) {
          notificationType = isToday ? "today" : "tomorrow";
          icon = isToday ? "today" : "time";
        }

        return {
          id: apt.appointmentID,
          type: notificationType,
          messages,
          icon,
          time: aptDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          date: aptDate.toLocaleDateString('en-US'),
          status: apt.status
        };
      });

      setNotifications(notificationItems);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchAppointments().finally(() => setRefreshing(false));
  }, []);

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return ['#10B981', '#059669'];
      case 'today': return ['#F59E0B', '#D97706'];
      case 'tomorrow': return ['#6366F1', '#4F46E5'];
      default: return ['#6B7280', '#4B5563'];
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <LinearGradient
            key={notification.id}
            colors={getNotificationColor(notification.type)}
            style={styles.notificationCard}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={notification.icon} size={24} color="#FFF" />
            </View>
            <View style={styles.contentContainer}>
              {notification.messages.map((message, index) => (
                <Text key={index} style={styles.message}>
                  {message}
                </Text>
              ))}
              <Text style={styles.time}>
                {notification.date} - {notification.time}
              </Text>
              <Text style={styles.status}>
                {language.notificationStatus}: {notification.status}
              </Text>
            </View>
          </LinearGradient>
        ))
      ) : (
        <View style={styles.noNotifications}>
          <Ionicons name="notifications-off-outline" size={64} color="#9CA3AF" />
          <Text style={styles.noNotificationsText}>{language.notificationNoNotifications}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
    lineHeight: 22, // Added for better spacing between multiple messages
  },
  time: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  status: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  noNotifications: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  noNotificationsText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
