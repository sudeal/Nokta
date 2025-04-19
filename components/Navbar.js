import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from '@react-native-masked-view/masked-view';

export default function Navbar({ location }) {
  const navigation = useNavigation();

  return (
    <View style={styles.navbar}>
      <View style={styles.leftContainer}>
        {location}
      </View>
      <View style={styles.centerContainer}>
        <MaskedView
          maskElement={<Text style={styles.logoText}>Nokta</Text>}
        >
          <LinearGradient
            colors={['#4CC9F0', '#4361EE', '#7209B7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: 40 }}
          >
            <Text style={[styles.logoText, { opacity: 0 }]}>Nokta</Text>
          </LinearGradient>
        </MaskedView>
      </View>
      <View style={styles.rightContainer}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.08)']}
            style={styles.iconButtonGradient}
          >
            <Ionicons name="person-outline" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flex: 0.8,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingRight: 10,
  },
  centerContainer: {
    flex: 1.2,
    alignItems: "center",
    height: 40,
    paddingHorizontal: 10,
  },
  rightContainer: {
    flex: 0.8,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 1,
  },
  iconButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 23,
  },
});
