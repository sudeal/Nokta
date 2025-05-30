import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Harf animasyonları için
  const letterAnimations = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    // Sadece başlık animasyonunu başlat
    Animated.sequence([
      Animated.timing(letterAnimations[0], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(letterAnimations[1], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(letterAnimations[2], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(letterAnimations[3], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(letterAnimations[4], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!email) {
      newErrors.email = "E-posta alanı zorunludur";
      isValid = false;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = "Geçerli bir e-posta adresi giriniz";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Şifre alanı zorunludur";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Önce login isteği
      const loginResponse = await fetch('https://nokta-appservice.azurewebsites.net/api/Users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      if (!loginResponse.ok) {
        throw new Error('Login failed');
      }

      const loginText = await loginResponse.text();
      console.log('Login response:', loginText);

      if (loginText.includes('Login successful')) {
        // Login başarılıysa kullanıcı bilgilerini al
        const userResponse = await fetch(
          `https://nokta-appservice.azurewebsites.net/api/Users/email/${encodeURIComponent(email)}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );

        if (!userResponse.ok) {
          console.error('User data response status:', userResponse.status);
          const errorText = await userResponse.text();
          console.error('User data error response:', errorText);
          throw new Error('Failed to get user data');
        }

        const userData = await userResponse.json();
        console.log('User data received:', userData);

        if (!userData || !userData.userID) {
          throw new Error('Invalid user data received');
        }

        // Kullanıcı bilgilerini AsyncStorage'a kaydet
        const userDataToStore = {
          userID: userData.userID,
          email: userData.email,
          name: userData.name
        };
        
        console.log('Storing user data:', userDataToStore);
        await AsyncStorage.setItem('userData', JSON.stringify(userDataToStore));

        // Ana sayfaya yönlendir
        navigation.replace('Home');
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = ({
    icon,
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    keyboardType,
    name,
  }) => {
    const hasError = errors[name];
    
    return (
      <View style={styles.inputContainer}>
        <View style={[styles.inputWrapper, hasError && styles.inputError]}>
          <Ionicons
            name={icon}
            size={20}
            color={hasError ? "#ff3b30" : "#666"}
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, hasError && styles.inputTextError]}
            placeholder={placeholder}
            placeholderTextColor="#999"
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            blurOnSubmit={false}
            returnKeyType="next"
          />
          {name === "password" && (
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          )}
        </View>
        {hasError && <Text style={styles.errorText}>{errors[name]}</Text>}
      </View>
    );
  };

  // Animasyonlu harf bileşeni
  const AnimatedLetter = ({ letter, index }) => {
    const translateY = letterAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: [20, 0],
    });

    const opacity = letterAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <Animated.Text
        style={[
          styles.letter,
          {
            transform: [{ translateY }],
            opacity,
          },
        ]}
      >
        {letter}
      </Animated.Text>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={["#4c669f", "#3b5998", "#192f6a"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <Ionicons name="log-in-outline" size={80} color="#fff" />
            </View>
            <View style={styles.titleContainer}>
              <AnimatedLetter letter="N" index={0} />
              <AnimatedLetter letter="o" index={1} />
              <AnimatedLetter letter="k" index={2} />
              <AnimatedLetter letter="t" index={3} />
              <AnimatedLetter letter="a" index={4} />
            </View>
            <Text style={styles.subtitle}>Giriş Yap</Text>
          </View>

          <View style={styles.formContainer}>
            {renderInput({
              icon: "mail-outline",
              placeholder: "E-posta",
              value: email,
              onChangeText: setEmail,
              keyboardType: "email-address",
              name: "email",
            })}

            {renderInput({
              icon: "lock-closed-outline",
              placeholder: "Şifre",
              value: password,
              onChangeText: setPassword,
              secureTextEntry: !showPassword,
              name: "password",
            })}

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Giriş Yap</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.registerLinkText}>
                Hesabın yok mu?{" "}
                <Text style={styles.registerLinkTextBold}>Kayıt Ol</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  letter: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginHorizontal: 1,
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    opacity: 0.9,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    backgroundColor: "#f9f9f9",
  },
  inputError: {
    borderColor: "#ff3b30",
    backgroundColor: "#fff5f5",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 55,
    color: "#333",
    fontSize: 16,
  },
  inputTextError: {
    color: "#ff3b30",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 15,
  },
  eyeIcon: {
    padding: 5,
  },
  loginButton: {
    backgroundColor: "#3b5998",
    borderRadius: 15,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#3b5998",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerLink: {
    marginTop: 20,
    alignItems: "center",
  },
  registerLinkText: {
    color: "#666",
    fontSize: 14,
  },
  registerLinkTextBold: {
    fontWeight: "bold",
    color: "#3b5998",
  },
});
