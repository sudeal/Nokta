import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, ScrollView } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');

  const handleRegister = () => {
    // Add your registration logic here
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Password:', password);
    console.log('Age:', age);
    console.log('Location:', location);
    // Navigate back to Login after registration
    navigation.navigate('Login');
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