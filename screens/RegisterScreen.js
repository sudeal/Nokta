import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";

const { width, height } = Dimensions.get("window");

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeInput, setActiveInput] = useState(null);

  // Animasyon değerleri
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(100)).current;

  // Harf animasyonları için
  const letterAnimations = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  // Input animasyonları için
  const inputAnimations = {
    name: useRef(new Animated.Value(0)).current,
    email: useRef(new Animated.Value(0)).current,
    phone: useRef(new Animated.Value(0)).current,
    password: useRef(new Animated.Value(0)).current,
    age: useRef(new Animated.Value(0)).current,
    location: useRef(new Animated.Value(0)).current,
  };

  useEffect(() => {
    // Sayfa yüklendiğinde animasyonları başlat
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(formTranslateY, {
        toValue: 0,
        duration: 800,
        delay: 300,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      // Harf animasyonları
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
      ]),
    ]).start();
  }, []);

  // Input alanı aktif olduğunda animasyon
  useEffect(() => {
    if (activeInput) {
      Animated.timing(inputAnimations[activeInput], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [activeInput]);

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !age || !location) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun!");
      return;
    }

    setLoading(true);

    const userData = {
      name,
      email,
      phoneNumber: phone,
      passwordHash: password,
      age: parseInt(age, 10),
      location,
    };

    try {
      const response = await fetch(
        "https://nokta-appservice.azurewebsites.net/api/Users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "text/plain",
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        const successMessage = await response.text();
        Alert.alert("Başarılı", successMessage || "Kayıt işlemi başarılı!");
        navigation.navigate("Login");
      } else {
        const errorMessage = await response.text();
        Alert.alert("Hata", errorMessage || "Kayıt işlemi başarısız.");
      }
    } catch (error) {
      Alert.alert("Hata", "Bir hata oluştu. Lütfen tekrar deneyin.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Input alanı için animasyonlu bileşen
  const AnimatedInput = ({
    icon,
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    keyboardType,
    name,
  }) => {
    const isActive = activeInput === name;
    const inputScale = inputAnimations[name].interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.05],
    });

    return (
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: "timing",
          duration: 500,
          delay:
            name === "name"
              ? 100
              : name === "email"
              ? 200
              : name === "phone"
              ? 300
              : name === "password"
              ? 400
              : name === "age"
              ? 500
              : 600,
        }}
        style={styles.inputContainer}
      >
        <Animated.View
          style={[styles.inputWrapper, { transform: [{ scale: inputScale }] }]}
        >
          <Ionicons
            name={icon}
            size={20}
            color={isActive ? "#3b5998" : "#666"}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#999"
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            onFocus={() => setActiveInput(name)}
            onBlur={() => setActiveInput(null)}
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
        </Animated.View>
      </MotiView>
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
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.logoPlaceholder}>
              <Ionicons name="person-add-outline" size={80} color="#fff" />
            </View>
            <View style={styles.titleContainer}>
              <AnimatedLetter letter="N" index={0} />
              <AnimatedLetter letter="o" index={1} />
              <AnimatedLetter letter="k" index={2} />
              <AnimatedLetter letter="t" index={3} />
              <AnimatedLetter letter="a" index={4} />
            </View>
            <Text style={styles.subtitle}>Hesap Oluştur</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: formOpacity,
                transform: [{ translateY: formTranslateY }],
              },
            ]}
          >
            <AnimatedInput
              icon="person-outline"
              placeholder="Ad Soyad"
              value={name}
              onChangeText={setName}
              name="name"
            />

            <AnimatedInput
              icon="mail-outline"
              placeholder="E-posta"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              name="email"
            />

            <AnimatedInput
              icon="call-outline"
              placeholder="Telefon"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              name="phone"
            />

            <AnimatedInput
              icon="lock-closed-outline"
              placeholder="Şifre"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              name="password"
            />

            <AnimatedInput
              icon="calendar-outline"
              placeholder="Yaş"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              name="age"
            />

            <AnimatedInput
              icon="location-outline"
              placeholder="Konum"
              value={location}
              onChangeText={setLocation}
              name="location"
            />

            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "timing", duration: 500, delay: 700 }}
            >
              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.registerButtonText}>Kayıt Ol</Text>
                )}
              </TouchableOpacity>
            </MotiView>

            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: "timing", duration: 500, delay: 800 }}
            >
              <TouchableOpacity
                style={styles.loginLink}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.loginLinkText}>
                  Zaten hesabın var mı?{" "}
                  <Text style={styles.loginLinkTextBold}>Giriş Yap</Text>
                </Text>
              </TouchableOpacity>
            </MotiView>
          </Animated.View>
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
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 55,
    color: "#333",
    fontSize: 16,
  },
  eyeIcon: {
    padding: 5,
  },
  registerButton: {
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
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginLink: {
    marginTop: 20,
    alignItems: "center",
  },
  loginLinkText: {
    color: "#666",
    fontSize: 14,
  },
  loginLinkTextBold: {
    fontWeight: "bold",
    color: "#3b5998",
  },
});
