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
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

// Validasyon regex'leri
const VALIDATION = {
  name: /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]{2,50}$/,
  email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  phone: /^(\+90|0)?[0-9]{10}$/,
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
  age: /^([1-9][0-9]|1[0-1][0-9]|120)$/,
};

// Hata mesajları
const ERROR_MESSAGES = {
  name: {
    required: "Ad Soyad alanı zorunludur",
    format: "Ad Soyad sadece harf içerebilir (2-50 karakter)",
    minLength: "Ad Soyad en az 2 karakter olmalıdır",
    maxLength: "Ad Soyad en fazla 50 karakter olmalıdır",
    invalidChars: "Ad Soyad sadece harf ve boşluk içerebilir",
  },
  email: {
    required: "E-posta alanı zorunludur",
    format: "Geçerli bir e-posta adresi giriniz (örn: example@domain.com)",
    domain: "Geçerli bir alan adı uzantısı giriniz (.com, .net, vb.)",
  },
  phone: {
    required: "Telefon alanı zorunludur",
    format:
      "Geçerli bir telefon numarası giriniz (05XX XXX XX XX veya +90 5XX XXX XX XX)",
    invalidChars: "Telefon numarası sadece rakam içerebilir",
    prefix: "Telefon numarası 05 ile başlamalıdır",
  },
  password: {
    required: "Şifre alanı zorunludur",
    format:
      "Şifre en az 8 karakter olmalı ve büyük harf, küçük harf, rakam ve özel karakter içermelidir",
    minLength: "Şifre en az 8 karakter olmalıdır",
    maxLength: "Şifre en fazla 20 karakter olmalıdır",
    uppercase: "Şifre en az 1 büyük harf içermelidir",
    lowercase: "Şifre en az 1 küçük harf içermelidir",
    number: "Şifre en az 1 rakam içermelidir",
    special: "Şifre en az 1 özel karakter içermelidir (!@#$%^&*)",
  },
  age: {
    required: "Yaş alanı zorunludur",
    format: "Yaş 13-120 arasında olmalıdır",
    min: "Yaşınız en az 13 olmalıdır",
    max: "Yaşınız en fazla 120 olmalıdır",
    invalidChars: "Yaş sadece rakam içerebilir",
  },
  location: {
    required: "Konum alanı zorunludur",
    format: "Geçerli bir konum giriniz",
  },
};

export default function RegisterScreen({ navigation }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    age: "",
    location: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

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

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (!touched[name]) {
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(touched).forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = ERROR_MESSAGES[field].required;
        isValid = false;
      } else {
        // Ad Soyad validasyonu
        if (field === "name") {
          if (formData[field].length < 2) {
            newErrors[field] = ERROR_MESSAGES[field].minLength;
            isValid = false;
          } else if (formData[field].length > 50) {
            newErrors[field] = ERROR_MESSAGES[field].maxLength;
            isValid = false;
          } else if (!VALIDATION[field].test(formData[field])) {
            newErrors[field] = ERROR_MESSAGES[field].invalidChars;
            isValid = false;
          }
        }

        // E-posta validasyonu
        if (field === "email") {
          if (!VALIDATION[field].test(formData[field])) {
            newErrors[field] = ERROR_MESSAGES[field].format;
            isValid = false;
          } else {
            const domain = formData[field].split("@")[1];
            if (!domain || !domain.includes(".")) {
              newErrors[field] = ERROR_MESSAGES[field].domain;
              isValid = false;
            }
          }
        }

        // Telefon validasyonu
        if (field === "phone") {
          const phoneNumber = formData[field].replace(/\s/g, "");
          if (!VALIDATION[field].test(phoneNumber)) {
            newErrors[field] = ERROR_MESSAGES[field].format;
            isValid = false;
          } else if (
            !phoneNumber.startsWith("05") &&
            !phoneNumber.startsWith("+90")
          ) {
            newErrors[field] = ERROR_MESSAGES[field].prefix;
            isValid = false;
          }
        }

        // Şifre validasyonu
        if (field === "password") {
          if (formData[field].length < 8) {
            newErrors[field] = ERROR_MESSAGES[field].minLength;
            isValid = false;
          } else if (formData[field].length > 20) {
            newErrors[field] = ERROR_MESSAGES[field].maxLength;
            isValid = false;
          } else if (!/[A-Z]/.test(formData[field])) {
            newErrors[field] = ERROR_MESSAGES[field].uppercase;
            isValid = false;
          } else if (!/[a-z]/.test(formData[field])) {
            newErrors[field] = ERROR_MESSAGES[field].lowercase;
            isValid = false;
          } else if (!/\d/.test(formData[field])) {
            newErrors[field] = ERROR_MESSAGES[field].number;
            isValid = false;
          } else if (!/[@$!%*?&]/.test(formData[field])) {
            newErrors[field] = ERROR_MESSAGES[field].special;
            isValid = false;
          }
        }

        // Yaş validasyonu
        if (field === "age") {
          const age = parseInt(formData[field]);
          if (isNaN(age)) {
            newErrors[field] = ERROR_MESSAGES[field].invalidChars;
            isValid = false;
          } else if (age < 13) {
            newErrors[field] = ERROR_MESSAGES[field].min;
            isValid = false;
          } else if (age > 120) {
            newErrors[field] = ERROR_MESSAGES[field].max;
            isValid = false;
          }
        }
      }
    });

    setErrors(newErrors);
    setIsFormValid(isValid);
  };

  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const debounceTimeout = setTimeout(() => {
        validateForm();
      }, 1000);

      return () => clearTimeout(debounceTimeout);
    }
  }, [formData]);

  const handleRegister = async () => {
    if (!isFormValid) {
      Alert.alert("Hata", "Lütfen tüm alanları doğru şekilde doldurun!");
      return;
    }

    setLoading(true);

    const userData = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phone,
      passwordHash: formData.password,
      age: parseInt(formData.age),
      location: formData.location,
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

  const renderInput = ({
    icon,
    placeholder,
    value,
    name,
    secureTextEntry,
    keyboardType,
    maxLength,
  }) => {
    const hasError = touched[name] && errors[name];

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
            onChangeText={(text) => handleInputChange(name, text)}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            maxLength={maxLength}
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
            <LanguageSelector style={styles.languageSelector} />
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
            <Text style={styles.subtitle}>{t('register')}</Text>
          </View>

          <View style={styles.formContainer}>
            {renderInput({
              icon: "person-outline",
              placeholder: t('fullName'),
              value: formData.name,
              name: "name",
              maxLength: 50,
            })}

            {renderInput({
              icon: "mail-outline",
              placeholder: t('email'),
              value: formData.email,
              name: "email",
              keyboardType: "email-address",
              autoCapitalize: "none",
            })}

            {renderInput({
              icon: "call-outline",
              placeholder: t('phone') || "Phone (05XX XXX XX XX)",
              value: formData.phone,
              name: "phone",
              keyboardType: "phone-pad",
              maxLength: 13,
            })}

            {renderInput({
              icon: "lock-closed-outline",
              placeholder: t('password'),
              value: formData.password,
              name: "password",
              secureTextEntry: !showPassword,
              maxLength: 20,
            })}

            {renderInput({
              icon: "calendar-outline",
              placeholder: t('age') || "Age",
              value: formData.age,
              name: "age",
              keyboardType: "numeric",
              maxLength: 3,
            })}

            {renderInput({
              icon: "location-outline",
              placeholder: t('location') || "Location",
              value: formData.location,
              name: "location",
            })}

            <TouchableOpacity
              style={[
                styles.registerButton,
                !isFormValid && styles.registerButtonDisabled,
              ]}
              onPress={handleRegister}
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>{t('register')}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.loginLinkText}>
                {t('alreadyHaveAccount')}{" "}
                <Text style={styles.loginLinkTextBold}>{t('login')}</Text>
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
  languageSelector: {
    marginBottom: 20,
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
  registerButtonDisabled: {
    backgroundColor: "#ccc",
    shadowColor: "#ccc",
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
