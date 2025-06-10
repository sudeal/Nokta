import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getUserProfile } from '../services/UserService';
import { useLanguage } from '../context/LanguageContext';

export default function ProfileScreen({ navigation }) {
  const { language } = useLanguage();
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const storedUserData = await AsyncStorage.getItem('userData');
      console.log('Stored user data:', storedUserData);
      
      if (!storedUserData) {
        setError(language.profilePleaseLogin);
        setLoading(false);
        setTimeout(() => {
          navigation.replace('Login');
        }, 2000);
        return;
      }

      const parsedUserData = JSON.parse(storedUserData);
      console.log('Parsed user data:', parsedUserData);
      
      if (!parsedUserData.userID) {
        setError(language.profileInvalidUserData);
        setLoading(false);
        setTimeout(() => {
          navigation.replace('Login');
        }, 2000);
        return;
      }

      setUserId(parsedUserData.userID);
      await fetchUserProfile(parsedUserData.userID);
    } catch (err) {
      console.error('Error loading user data:', err);
      setError(language.profileFailedToLoadUserData);
      setLoading(false);
      setTimeout(() => {
        navigation.replace('Login');
      }, 2000);
    }
  };

  const fetchUserProfile = async (id) => {
    try {
      setLoading(true);
      console.log('Fetching profile for ID:', id);
      const data = await getUserProfile(id);
      console.log('Profile data received:', data);
      setUserData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(language.profileFailedToLoadProfile);
      Alert.alert(language.profileError, language.profileFailedToLoadProfile);
    } finally {
      setLoading(false);
    }
  };

  const helpOptions = [
    {
      icon: "help-circle-outline",
      title: language.profileFAQ,
      onPress: () => navigation.navigate("FAQ"),
    },
    {
      icon: "mail-outline",
      title: language.profileContactUs,
      onPress: () => Linking.openURL("mailto:support@nokta.com"),
    },
    {
      icon: "call-outline",
      title: language.profileCustomerService,
      onPress: () => Linking.openURL("tel:+908502123456"),
    },
    {
      icon: "document-text-outline",
      title: language.profileTermsOfUse,
      onPress: () => navigation.navigate("Terms"),
    },
  ];

  const menuItems = [
    {
      icon: "calendar-outline",
      title: language.profileMyAppointments,
      onPress: () => navigation.navigate("Calendar"),
    },
    {
      icon: "notifications-outline",
      title: language.profileNotifications,
      onPress: () => navigation.navigate("Notification"),
    },
    {
      icon: "help-circle-outline",
      title: language.profileHelp,
      onPress: () => setHelpModalVisible(true),
    },
  ];

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      navigation.replace("Login");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert(language.profileError, language.profileCouldNotLogout);
    }
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
          colors={["#4C1D95", "#7C3AED"]}
          style={styles.modalGradient}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.titleContainer}>
                <Ionicons name="help-circle" size={30} color="#ffffff" />
                <Text style={styles.modalTitle}>{language.profileHowToUseNokta}</Text>
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
                  {language.profileWelcomeText}
                </Text>
              </View>

              <View style={styles.helpSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="search" size={24} color="#ffffff" />
                  <Text style={styles.sectionTitle}>{language.profileBrowse}</Text>
                </View>
                <Text style={styles.helpText}>
                  {language.profileBrowseHelp}
                </Text>
              </View>

              <View style={styles.helpSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="calendar" size={24} color="#ffffff" />
                  <Text style={styles.sectionTitle}>{language.profileMakingAppointment}</Text>
                </View>
                <Text style={styles.helpText}>
                  {language.profileMakingAppointmentHelp}
                </Text>
              </View>

              <View style={styles.helpSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="person" size={24} color="#ffffff" />
                  <Text style={styles.sectionTitle}>{language.profileMyAppointments}</Text>
                </View>
                <Text style={styles.helpText}>
                  {language.profileMyAppointmentsHelp}
                </Text>
              </View>

              <View style={styles.helpSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="chatbubbles" size={24} color="#ffffff" />
                  <Text style={styles.sectionTitle}>{language.profileMessaging}</Text>
                </View>
                <Text style={styles.helpText}>
                  {language.profileMessagingHelp}
                </Text>
              </View>

              <View style={styles.helpSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="calendar-outline" size={24} color="#ffffff" />
                  <Text style={styles.sectionTitle}>{language.profileCalendar}</Text>
                </View>
                <Text style={styles.helpText}>
                  {language.profileCalendarHelp}
                </Text>
              </View>

              <View style={styles.helpSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="notifications-outline" size={24} color="#ffffff" />
                  <Text style={styles.sectionTitle}>{language.profileNotifications}</Text>
                </View>
                <Text style={styles.helpText}>
                  {language.profileNotificationsHelp}
                </Text>
              </View>
            </ScrollView>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B63DB" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => loadUserData()}>
          <Text style={styles.retryButtonText}>{language.profileRetry}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#4B63DB', '#8B5CF6']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{language.profileTitle}</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {userData?.name?.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={24} color="#4B63DB" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{language.profileName}</Text>
                  <Text style={styles.infoValue}>{userData?.name || language.profileNotSet}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={24} color="#4B63DB" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{language.profileEmail}</Text>
                  <Text style={styles.infoValue}>{userData?.email || language.profileNotSet}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={24} color="#4B63DB" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{language.profilePhone}</Text>
                  <Text style={styles.infoValue}>{userData?.phoneNumber || language.profileNotSet}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={24} color="#4B63DB" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{language.profileLocation}</Text>
                  <Text style={styles.infoValue}>{userData?.location || language.profileNotSet}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={24} color="#4B63DB" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{language.profileAge}</Text>
                  <Text style={styles.infoValue}>{userData?.age || language.profileNotSet}</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

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
        <Text style={styles.forgotPasswordText}>{language.profileForgotPassword}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
        <Text style={styles.logoutText}>{language.profileLogOut}</Text>
      </TouchableOpacity>

      {renderHelpModal()}
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
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#666',
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    padding: 10,
    backgroundColor: '#4B63DB',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4B63DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  infoSection: {
    gap: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  editButton: {
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
  gradientButton: {
    padding: 16,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    backgroundColor: "rgba(76, 29, 149, 0.15)",
  },
  modalGradient: {
    flex: 1,
    marginTop: 50,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#F5F3FF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD6FE",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4C1D95",
    padding: 10,
    borderRadius: 15,
    shadowColor: "#4C1D95",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginLeft: 10,
    letterSpacing: 0.8,
  },
  closeButton: {
    padding: 8,
    backgroundColor: "#4C1D95",
    borderRadius: 25,
    shadowColor: "#4C1D95",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  helpTextContainer: {
    flex: 1,
  },
  helpSection: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#4C1D95",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#7C3AED",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#4C1D95",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    marginLeft: 12,
    letterSpacing: 0.8,
  },
  welcomeText: {
    fontSize: 19,
    lineHeight: 28,
    color: "#4C1D95",
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 0.7,
    marginVertical: 10,
  },
  helpText: {
    fontSize: 16,
    lineHeight: 26,
    color: "#6B7280",
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 8,
    fontWeight: "400",
    letterSpacing: 0.5,
  },
});