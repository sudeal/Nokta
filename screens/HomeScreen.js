import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import useLocation from "../hooks/useLocation";
import Navbar from "../components/Navbar";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const { location, address, errorMsg, loading } = useLocation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderLocationInfo = () => {
    if (loading) {
      return (
        <Animated.View
          style={[
            styles.locationContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ActivityIndicator size="large" color="#4a90e2" />
        </Animated.View>
      );
    }

    if (errorMsg) {
      return (
        <Animated.View
          style={[
            styles.locationContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.errorText}>{errorMsg}</Text>
        </Animated.View>
      );
    }

    if (address) {
      return (
        <Animated.View
          style={[
            styles.locationContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={["#4a90e2", "#357abd"]}
            style={styles.locationGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.locationIconContainer}>
              <Ionicons name="location" size={24} color="#fff" />
            </View>
            <Text style={styles.locationText}>{address.formattedAddress}</Text>
          </LinearGradient>
        </Animated.View>
      );
    }

    return null;
  };

  const renderMenuButton = (icon, title, onPress, delay) => {
    const buttonAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 500,
        delay: delay,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.menuButtonContainer,
          {
            opacity: buttonAnim,
            transform: [
              {
                scale: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity style={styles.menuButton} onPress={onPress}>
          <LinearGradient
            colors={["#4a90e2", "#357abd"]}
            style={styles.menuButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name={icon} size={32} color="#fff" />
            <Text style={styles.buttonText}>{title}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Navbar />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>Welcome to Nokta</Text>
          <Text style={styles.subtitle}>Your Personal Assistant</Text>
        </Animated.View>

        {renderLocationInfo()}

        <View style={styles.buttonGrid}>
          {renderMenuButton("compass", "Browse", () => navigation.navigate("Browse"), 200)}
          {renderMenuButton("calendar", "Calendar", () => navigation.navigate("Calendar"), 300)}
          {renderMenuButton("chatbubbles", "Messages", () => navigation.navigate("Messages"), 400)}
          {renderMenuButton("add-circle", "New Booking", () => navigation.navigate("NewBooking"), 500)}
          {renderMenuButton("notifications", "Notifications", () => navigation.navigate("Notification"), 600)}
          {renderMenuButton("search", "Search", () => navigation.navigate("Search"), 700)}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.replace("Login")}
        >
          <LinearGradient
            colors={["#ff6347", "#ff4500"]}
            style={styles.logoutGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="log-out-outline" size={24} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
    alignItems: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  locationContainer: {
    width: "100%",
    marginBottom: 30,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  locationGradient: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  locationText: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  errorText: {
    color: "#ff6347",
    fontSize: 16,
    textAlign: "center",
    padding: 20,
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 5,
  },
  menuButtonContainer: {
    width: (width - 50) / 2,
    marginBottom: 15,
  },
  menuButton: {
    height: 120,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  logoutButton: {
    width: "80%",
    height: 50,
    borderRadius: 25,
    marginTop: 30,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logoutGradient: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
