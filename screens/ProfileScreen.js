import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileScreen({ navigation }) {
  const [helpModalVisible, setHelpModalVisible] = useState(false);

  const user = {
    name: "Melike Yılmaz",
    email: "melike@example.com",
    phone: "+90 555 123 4567",
  };

  const helpOptions = [
    {
      icon: "help-circle-outline",
      title: "Sık Sorulan Sorular",
      onPress: () => navigation.navigate("FAQ"), // FAQ ekranı oluşturulmalı
    },
    {
      icon: "mail-outline",
      title: "Bize Ulaşın",
      onPress: () => Linking.openURL("mailto:support@nokta.com"),
    },
    {
      icon: "call-outline",
      title: "Müşteri Hizmetleri",
      onPress: () => Linking.openURL("tel:+908502123456"),
    },
    {
      icon: "document-text-outline",
      title: "Kullanım Koşulları",
      onPress: () => navigation.navigate("Terms"), // Terms ekranı oluşturulmalı
    },
  ];

  const menuItems = [
    {
      icon: "calendar-outline",
      title: "Randevularım",
      onPress: () => navigation.navigate("Calendar"),
    },
    {
      icon: "notifications-outline",
      title: "Bildirimler",
      onPress: () => navigation.navigate("Notification"),
    },
    {
      icon: "help-circle-outline",
      title: "Yardım",
      onPress: () => setHelpModalVisible(true),
    },
  ];

  const handleForgotPassword = () => {
    // Add your forgot password logic here
    navigation.navigate("ForgotPassword"); // You'll need to create this screen
  };

  const renderHelpModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={helpModalVisible}
      onRequestClose={() => setHelpModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <LinearGradient
          colors={["#4C1D95", "#7C3AED"]} // Deeper purple gradient
          style={styles.modalGradient}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.titleContainer}>
                <Ionicons name="help-circle" size={30} color="#ffffff" />
                <Text style={styles.modalTitle}>How to Use Nokta App?</Text>
              </View>
              <TouchableOpacity
                onPress={() => setHelpModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close-circle" size={32} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.helpTextContainer}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.helpSection}>
                <Text style={styles.welcomeText}>
                  Welcome to Nokta app! We would like to show you how to make
                  appointments and use our application.
                </Text>
              </View>

              <View style={styles.helpSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="search" size={24} color="#ffffff" />
                  <Text style={styles.sectionTitle}>Browse</Text>
                </View>
                <Text style={styles.helpText}>
                  You can see all businesses in the Browse tab on the home page.
                  Businesses are categorized (hairdresser, beauty center, spa,
                  etc.). You can list the businesses in that area by selecting the
                  category you want.
                </Text>
              </View>

              <View style={styles.helpSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="calendar" size={24} color="#ffffff" />
                  <Text style={styles.sectionTitle}>Making an Appointment</Text>
                </View>
                <Text style={styles.helpText}>
                  In the New Booking tab, you will see businesses categorized by
                  type. After selecting the business you want:
                  {"\n"}
                  • Select service
                  {"\n"}
                  • Choose date and time
                  {"\n"}
                  • Confirm and payment
                  {"\n"}
                  Follow these steps to easily create your appointment.
                </Text>
              </View>

              <View style={styles.helpSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="person" size={24} color="#ffffff" />
                  <Text style={styles.sectionTitle}>My Appointments</Text>
                </View>
                <Text style={styles.helpText}>
                  In the "My Appointments" section of your profile page or in the
                  Calendar tab, you can view:
                  {"\n"}
                  • Your active appointments
                  {"\n"}
                  • Your past appointments
                  {"\n"}
                  • Your upcoming appointments
                </Text>
              </View>

              <View style={styles.helpSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="chatbubbles" size={24} color="#ffffff" />
                  <Text style={styles.sectionTitle}>Messaging</Text>
                </View>
                <Text style={styles.helpText}>
                  You can directly message with businesses you have appointments
                  with in the Messages tab. You can discuss appointment details
                  and ask your questions.
                </Text>
              </View>

              <View style={styles.helpSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="calendar-outline" size={24} color="#ffffff" />
                  <Text style={styles.sectionTitle}>Calendar</Text>
                </View>
                <Text style={styles.helpText}>
                  In the Calendar tab, you can view all your appointments in
                  calendar format and better plan your appointments.
                </Text>
              </View>

              <View style={styles.helpSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="notifications-outline" size={24} color="#ffffff" />
                  <Text style={styles.sectionTitle}>Notifications</Text>
                </View>
                <Text style={styles.helpText}>
                  Don't forget to keep your notifications on for appointment
                  reminders, business messages, and special offers!
                </Text>
              </View>
            </ScrollView>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["#4C1D95", "#7C3AED"]}
        style={styles.header}
      >
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <View style={styles.contactInfoContainer}>
            <Ionicons name="mail-outline" size={20} color="#E9D5FF" />
            <Text style={styles.email}>{user.email}</Text>
          </View>
          <View style={styles.contactInfoContainer}>
            <Ionicons name="call-outline" size={20} color="#E9D5FF" />
            <Text style={styles.phone}>{user.phone}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name={item.icon} size={24} color="#7C3AED" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#7C3AED" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.forgotPasswordButton}
        onPress={handleForgotPassword}
      >
        <Ionicons name="key-outline" size={24} color="#7C3AED" />
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>

      {renderHelpModal()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F3FF", // Light purple background
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#4C1D95",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
  },
  profileInfo: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  contactInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  email: {
    fontSize: 16,
    color: "#E9D5FF",
    marginLeft: 8,
    letterSpacing: 0.3,
  },
  phone: {
    fontSize: 16,
    color: "#E9D5FF",
    marginLeft: 8,
    letterSpacing: 0.3,
  },
  menuContainer: {
    backgroundColor: "#FFF",
    marginTop: 25,
    marginHorizontal: 15,
    borderRadius: 20,
    paddingVertical: 8,
    shadowColor: "#4C1D95",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F3FF",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#4C1D95",
    letterSpacing: 0.3,
    fontWeight: "500",
  },
  forgotPasswordButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    marginTop: 25,
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 15,
    shadowColor: "#7C3AED",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  forgotPasswordText: {
    fontSize: 16,
    color: "#7C3AED",
    marginLeft: 10,
    letterSpacing: 0.3,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    marginTop: 25,
    marginBottom: 30,
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 15,
    shadowColor: "#FF3B30",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#FFE4E4",
  },
  logoutText: {
    fontSize: 16,
    color: "#FF3B30",
    marginLeft: 10,
    letterSpacing: 0.3,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(76, 29, 149, 0.15)', // Transparent deep purple
  },
  modalGradient: {
    flex: 1,
    marginTop: 50,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#F5F3FF', // Very light purple background
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD6FE',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4C1D95', // Deep purple
    padding: 10,
    borderRadius: 15,
    shadowColor: '#4C1D95',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 10,
    letterSpacing: 0.8,
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#4C1D95',
    borderRadius: 25,
    shadowColor: '#4C1D95',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  helpTextContainer: {
    flex: 1,
  },
  helpSection: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#4C1D95',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#7C3AED',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#4C1D95',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 12,
    letterSpacing: 0.8,
  },
  welcomeText: {
    fontSize: 19,
    lineHeight: 28,
    color: '#4C1D95',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.7,
    marginVertical: 10,
  },
  helpText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#6B7280',
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 8,
    fontWeight: '400',
    letterSpacing: 0.5,
  }
});