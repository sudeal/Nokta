import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import NewBookingScreen from "./screens/NewBookingScreen";
import NotificationScreen from "./screens/NotificationScreen";
import BusinessDetailScreen from "./screens/BusinessDetailScreen";
import BusinessListScreen from "./screens/BusinessListScreen";
import CalendarScreen from "./screens/CalendarScreen";
import MessagesScreen from "./screens/MessagesScreen";
import { StyleSheet } from "react-native";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="NewBooking" component={NewBookingScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Messages" component={MessagesScreen} />
        <Stack.Screen
          name="BusinessList"
          component={BusinessListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BusinessDetail"
          component={BusinessDetailScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
