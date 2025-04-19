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

const getShortAddress = (fullAddress) => {
  if (!fullAddress) return '';
  const parts = fullAddress.split(',');
  // İlçe ve il bilgisini al (son iki parça)
  const relevantParts = parts.slice(-3, -1);
  return relevantParts.map(part => part.trim()).join(', ');
};

export default function HomeScreen({ navigation }) {
  const { location, address, errorMsg, loading } = useLocation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const firstName = global.userData?.firstName || "Misafir";

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
        <View style={styles.locationSmallContainer}>
          <ActivityIndicator size="small" color="#4CC9F0" />
        </View>
      );
    }

    if (errorMsg) {
      return (
        <View style={styles.locationSmallContainer}>
          <Text style={styles.locationSmallText}>Konum alınamadı</Text>
        </View>
      );
    }

    if (address) {
      // Tam adresi state'de sakla ama kısa versiyonunu göster
      const shortAddress = getShortAddress(address.formattedAddress);
      return (
        <View style={styles.locationSmallContainer}>
          <Ionicons name="location" size={16} color="rgba(255, 255, 255, 0.9)" style={styles.locationIcon} />
          <Text style={styles.locationSmallText}>{shortAddress}</Text>
        </View>
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
            colors={["#2d1b69", "#1a1b4b"]}
            style={styles.menuButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={icon} size={32} color="#fff" />
            </View>
            <Text style={styles.buttonText}>{title}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <LinearGradient
      colors={["#0A1128", "#1C2541"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <Navbar location={renderLocationInfo()} />
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
            <Text style={styles.welcomeText}>Welcome 👋</Text>
          </Animated.View>

          <View style={styles.buttonGrid}>
            <View style={styles.buttonRow}>
              {renderMenuButton("add-circle", "New Booking", () => navigation.navigate("NewBooking"), 200)}
              {renderMenuButton("notifications", "Notifications", () => navigation.navigate("Notification"), 300)}
            </View>
            <View style={styles.buttonRow}>
              {renderMenuButton("calendar", "Calendar", () => navigation.navigate("Calendar"), 400)}
              {renderMenuButton("chatbubbles", "Messages", () => navigation.navigate("Messages"), 500)}
            </View>
          </View>
        </ScrollView>
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
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonGrid: {
    width: "100%",
    maxWidth: 600,
    alignSelf: 'center',
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  menuButtonContainer: {
    width: (width - 60) / 2,
    marginHorizontal: 10,
  },
  menuButton: {
    height: 160,
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "500",
    textAlign: "center",
  },
  locationSmallContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  locationIcon: {
    marginRight: 6,
  },
  locationSmallText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: '500',
  },
});
