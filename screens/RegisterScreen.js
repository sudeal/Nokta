import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, ScrollView, Alert } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');

  const handleRegister = async () => {
    // Boş alan kontrolü
    if (!name || !email || !phone || !password || !age || !location) {
      Alert.alert('Hata', 'Boş alan bırakılmamalı!');
      return;
    }

    const userData = {
      name,
      email,
      phoneNumber: phone,
      passwordHash: password, // Ideally, hash the password before sending
      age: parseInt(age, 10),
      location,
    };

    try {
      const response = await fetch('https://nokta-appservice.azurewebsites.net/api/Users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'text/plain',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const successMessage = await response.text(); // Yanıtı text olarak alıyoruz
        Alert.alert('Başarılı', successMessage || 'Kayıt işlemi başarılı!');
        navigation.navigate('Login');
      } else {
        const errorMessage = await response.text(); // Hata mesajını text olarak alıyoruz
        Alert.alert('Hata', errorMessage || 'Kayıt işlemi başarısız.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <Button title="Register" onPress={handleRegister} />
      <Button
        title="Back to Login"
        onPress={() => navigation.goBack()}
        color="gray"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});