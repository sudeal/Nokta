import React, { useRef } from "react";
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 100;

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

  const handleCall = () => {
    Linking.openURL(`tel:${business.phone}`);
  };

  const handleMap = () => {
    const address = encodeURIComponent(business.address);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${address}`);
  };

  const getBusinessTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case "restaurant":
        return "restaurant";
      case "cafe":
        return "cafe";
      case "fast food":
        return "fast-food";
      case "dessert":
        return "ice-cream";
      default:
        return "business";
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Image source={{ uri: business.image }} style={styles.headerImage} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.gradient}
        />
        <Animated.View style={[styles.headerContent, { opacity: headerOpacity }]}>
          <Animated.Text style={[styles.title, { transform: [{ scale: titleScale }] }]}>
            {business.name}
          </Animated.Text>
          <View style={styles.headerInfo}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{business.rating}</Text>
            </View>
            <View style={styles.typeContainer}>
              <Ionicons name={getBusinessTypeIcon(business.type)} size={16} color="#fff" />
              <Text style={styles.typeText}>{business.type}</Text>
            </View>
            <Text style={styles.priceRange}>{business.priceRange}</Text>
            <Text style={styles.distance}>{business.distance}</Text>
          </View>
        </Animated.View>
      </Animated.View>

      <ScrollView
        style={styles.content}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500 }}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Hakkında</Text>
          <Text style={styles.description}>{business.description}</Text>
        </MotiView>

        {business.features && business.features.length > 0 && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500, delay: 200 }}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>Özellikler</Text>
            <View style={styles.featuresGrid}>
              {business.features.map((feature, index) => {
                const [icon, text] = feature.split(": ");
                return (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons name={icon} size={24} color="#FF6B6B" />
                    <Text style={styles.featureText}>{text}</Text>
                  </View>
                );
              })}
            </View>
          </MotiView>
        )}

        {business.openingHours && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500, delay: 400 }}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>Çalışma Saatleri</Text>
            {Object.entries(business.openingHours).map(([day, hours]) => (
              <View key={day} style={styles.hoursRow}>
                <Text style={styles.dayText}>{day}</Text>
                <Text style={styles.hoursText}>{hours}</Text>
              </View>
            ))}
          </MotiView>
        )}

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500, delay: 600 }}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Konum</Text>
          <TouchableOpacity style={styles.mapButton} onPress={handleMap}>
            <Ionicons name="location" size={24} color="#FF6B6B" />
            <Text style={styles.addressText}>{business.address}</Text>
          </TouchableOpacity>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500, delay: 800 }}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>İletişim</Text>
          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <Ionicons name="call" size={24} color="#FF6B6B" />
            <Text style={styles.phoneText}>{business.phone}</Text>
          </TouchableOpacity>
        </MotiView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    zIndex: 1,
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
  },
  headerContent: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  ratingText: {
    color: "#fff",
    marginLeft: 4,
    fontWeight: "600",
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  typeText: {
    color: "#fff",
    marginLeft: 4,
    fontWeight: "600",
  },
  priceRange: {
    color: "#fff",
    marginRight: 8,
  },
  distance: {
    color: "#fff",
  },
  content: {
    flex: 1,
    marginTop: HEADER_HEIGHT,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  featureItem: {
    width: "50%",
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  featureText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dayText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  hoursText: {
    fontSize: 16,
    color: "#666",
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 8,
  },
  addressText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 8,
  },
  phoneText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#666",
  },
}); 