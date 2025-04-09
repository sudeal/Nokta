import React from "react";
import { View, Text, StyleSheet } from "react-native";
import useLocation from "../hooks/useLocation";

export default function Navbar() {
  const location = useLocation();

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>NOKTA</Text>
      <View style={styles.locationWrapper}>
        <Text style={styles.location}>
          {location
            ? `📍 ${location.ilce}, ${location.il}`
            : "Konum alınıyor..."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  logo: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  locationWrapper: {
    flex: 1,
    alignItems: "flex-end",
  },
  location: {
    color: "white",
    fontSize: 14,
  },
});
