import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileScreen({ navigation }) {
  const user = {
    name: "Melike Yılmaz",
    email: "melike@example.com",
    phone: "+90 555 123 4567",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  };

  const menuItems = [
    {
      icon: "person-outline",
      title: "Kişisel Bilgiler",
      onPress: () => {},
    },
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
      icon: "settings-outline",
      title: "Ayarlar",
      onPress: () => {},
    },
    {
      icon: "help-circle-outline",
      title: "Yardım",
      onPress: () => {},
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["#007AFF", "#00C6FF"]}
        style={styles.header}
      >
        <View style={styles.profileInfo}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.phone}>{user.phone}</Text>
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
              <Ionicons name={item.icon} size={24} color="#007AFF" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileInfo: {
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#FFF",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#FFF",
    marginBottom: 5,
  },
  phone: {
    fontSize: 16,
    color: "#FFF",
  },
  menuContainer: {
    backgroundColor: "#FFF",
    marginTop: 20,
    borderRadius: 15,
    marginHorizontal: 15,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#000",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    marginTop: 20,
    marginBottom: 30,
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 15,
  },
  logoutText: {
    fontSize: 16,
    color: "#FF3B30",
    marginLeft: 10,
  },
}); 