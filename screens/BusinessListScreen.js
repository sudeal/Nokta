import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import useLocation from "../hooks/useLocation";

const categoryData = {
  "Health Services": {
    color: ["#4158D0", "#C850C0"],
    icon: "medical",
    subcategories: [
      { name: "Doctor", icon: "medical-outline" },
      { name: "Dentist", icon: "tooth-outline" },
      { name: "Vet", icon: "paw-outline" },
    ],
  },
  "Food & Beverages": {
    color: ["#FF9966", "#FF5E62"],
    icon: "restaurant",
    subcategories: [
      { name: "Restaurants", icon: "restaurant-outline" },
      { name: "Desserts", icon: "ice-cream-outline" },
      { name: "Fine Dining", icon: "wine-outline" },
      { name: "Pub & Bars", icon: "beer-outline" },
    ],
  },
  Selfcare: {
    color: ["#8E2DE2", "#4A00E0"],
    icon: "cut",
    subcategories: [
      { name: "Male Coiffure", icon: "man-outline" },
      { name: "Female Coiffure", icon: "woman-outline" },
      { name: "Nail Studios", icon: "hand-left-outline" },
      { name: "Tattoo & Piercing", icon: "brush-outline" },
    ],
  },
};

const getDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) {
    return null;
  }

  const lat1Rad = (lat1 * Math.PI) / 180;
  const lon1Rad = (lon1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const lon2Rad = (lon2 * Math.PI) / 180;

  const R = 6371; // Dünya'nın yarıçapı (km)
  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

const getWelcomeMessage = () => {
  return "Quality services you're looking for are at your fingertips 🌟";
};

const formatHourToTime = (decimalHour) => {
  if (decimalHour === undefined || decimalHour === null) return "";

  const hours = Math.floor(decimalHour);
  const minutes = Math.round((decimalHour - hours) * 60);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

export default function BusinessListScreen({ route, navigation }) {
  const { category } = route.params;
  const categoryInfo = categoryData[category] || {
    color: ["#1A1A1A", "#2D2D2D"],
    icon: "business",
    subcategories: [],
  };
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const {
    location: userLocation,
    address: userAddress,
    errorMsg: locationError,
    loading: locationLoading,
  } = useLocation();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [selectedSubcategory]);

  const fetchBusinesses = async (subcategory) => {
    setLoading(true);
    try {
      console.log("Fetching businesses...");
      console.log("User address:", userAddress);

      const response = await fetch(
        "https://nokta-appservice.azurewebsites.net/api/Business"
      );
      const data = await response.json();

      console.log("API Response:", data);

      let filteredBusinesses = [];

      // Kategori bazında filtreleme
      if (category === "Food & Beverages") {
        switch (subcategory.name) {
          case "Restaurants":
            filteredBusinesses = data.filter((business) =>
              business.name.startsWith("Restaurant -")
            );
            break;
          case "Desserts":
            filteredBusinesses = data.filter(
              (business) =>
                business.name.startsWith("Dessert -") ||
                business.name.startsWith("Pastry -")
            );
            break;
          case "Fine Dining":
            filteredBusinesses = data.filter((business) =>
              business.name.startsWith("Fine Dining -")
            );
            break;
          case "Pub & Bars":
            filteredBusinesses = data.filter(
              (business) =>
                business.name.startsWith("Pub -") ||
                business.name.startsWith("Bar -")
            );
            break;
        }
      }

      // İlçe bazında filtreleme
      if (userAddress?.district) {
        console.log("Filtering by district:", userAddress.district);

        filteredBusinesses = filteredBusinesses.filter((business) => {
          // İşletmenin ilçe bilgisini adresinden çıkar
          const businessDistrict = business.address
            ?.split(",")
            .map((part) => part.trim())
            .find(
              (part) =>
                part.toLowerCase() === userAddress.district.toLowerCase()
            );

          console.log("Business:", business.name);
          console.log("Business district:", businessDistrict);

          return businessDistrict !== undefined;
        });
      } else {
        console.log("No district information available");
      }

      setBusinesses(filteredBusinesses);
    } catch (error) {
      console.error("Error in fetchBusinesses:", error);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubcategoryPress = (subcategory) => {
    setSelectedSubcategory(subcategory);
    fetchBusinesses(subcategory);
  };

  const handleBusinessPress = (business) => {
    navigation.navigate("BusinessDetail", { business });
  };

  const formatDistance = (distance) => {
    if (distance === null || distance === undefined || isNaN(distance)) {
      return "Calculating...";
    }
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  const renderBusinessCard = (business, index) => (
    <Animated.View
      key={business.businessID || index}
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        style={[styles.businessCard, { marginTop: index === 0 ? 0 : 16 }]}
        onPress={() => handleBusinessPress(business)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={categoryInfo.color}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.businessGradient}
        >
          <View style={styles.businessInfo}>
            <Text style={styles.businessName}>
              {business?.name || "Unnamed Business"}
            </Text>
            <Text style={styles.businessAddress}>
              {business?.address || "Address not available"}
            </Text>
            <View style={styles.businessDetailsRow}>
              <View style={styles.businessHoursContainer}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color="rgba(255, 255, 255, 0.9)"
                />
                <Text style={styles.businessHours}>
                  {business?.openingHour != null &&
                  business?.closingHour != null
                    ? `${formatHourToTime(
                        business.openingHour
                      )} - ${formatHourToTime(business.closingHour)}`
                    : "Hours not available"}
                </Text>
              </View>
              <View style={styles.distanceContainer}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color="rgba(255, 255, 255, 0.9)"
                />
                <Text style={styles.distanceText}>
                  {userAddress?.district || "Loading location..."}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.arrowContainer}>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderContent = () => {
    if (selectedSubcategory) {
      if (loading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        );
      }

      if (!businesses || businesses.length === 0) {
        return (
          <Animated.View
            style={[
              styles.noResultsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.noResultsText}>İşletme bulunamadı</Text>
          </Animated.View>
        );
      }

      return (
        <Animated.ScrollView
          style={[
            styles.businessList,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.welcomeContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.welcomeText}>{getWelcomeMessage()}</Text>
          </Animated.View>

          {businesses.map((business, index) =>
            renderBusinessCard(business, index)
          )}
        </Animated.ScrollView>
      );
    }

    return (
      <Animated.View
        style={[
          styles.subcategoriesContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {categoryInfo.subcategories.map((subcategory, index) => (
          <TouchableOpacity
            key={index}
            style={styles.subcategoryCard}
            onPress={() => handleSubcategoryPress(subcategory)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={categoryInfo.color}
              style={styles.subcategoryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name={subcategory.icon || "business"}
                  size={32}
                  color="#fff"
                />
              </View>
              <Text style={styles.subcategoryTitle}>
                {subcategory.name || "Unknown Category"}
              </Text>
              <View style={styles.arrowContainer}>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </Animated.View>
    );
  };

  return (
    <LinearGradient
      colors={["#1A1A1A", "#2D2D2D"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (selectedSubcategory) {
                setSelectedSubcategory(null);
                setBusinesses([]);
              } else {
                navigation.goBack();
              }
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {selectedSubcategory ? selectedSubcategory.name : category}
          </Text>
        </Animated.View>

        <View style={styles.content}>{renderContent()}</View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 20,
  },
  backButton: {
    marginRight: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  subcategoriesContainer: {
    padding: 16,
  },
  subcategoryCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  subcategoryGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  subcategoryTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noResultsText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  businessList: {
    padding: 16,
  },
  businessCard: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  businessGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  businessAddress: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  businessDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  businessHoursContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  businessHours: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginLeft: 4,
    fontWeight: "500",
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  distanceText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginLeft: 4,
    fontWeight: "500",
  },
  welcomeContainer: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  welcomeText: {
    color: "#fff",
    fontSize: 17,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
});
