import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const Template1 = ({ business, colorScheme }) => {
  // Template 1: No features enabled
  
  const handleCall = () => {
    if (business?.contactNumber) {
      Linking.openURL(`tel:${business.contactNumber}`);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={colorScheme.gradient || ['#4B63DB', '#8B5CF6', '#A682FF']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.businessInfo}>
          <Text style={styles.businessName}>{business?.name || 'Business Name'}</Text>
          <Text style={styles.businessCategory}>{business?.category || 'Category'}</Text>
        </View>
      </LinearGradient>
      
      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={24} color={colorScheme.primary} />
            <Text style={[styles.sectionTitle, { color: colorScheme.primary }]}>About</Text>
          </View>
          <Text style={styles.description}>{business?.description || 'No description available'}</Text>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="call-outline" size={24} color={colorScheme.primary} />
            <Text style={[styles.sectionTitle, { color: colorScheme.primary }]}>Contact</Text>
          </View>
          <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
            <Text style={styles.contactText}>{business?.contactNumber || 'No phone number available'}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="mail-outline" size={24} color={colorScheme.primary} />
            <Text style={[styles.sectionTitle, { color: colorScheme.primary }]}>Email</Text>
          </View>
          <Text style={styles.contactText}>{business?.email || 'No email available'}</Text>
        </View>
        
        <View style={styles.templateInfo}>
          <Text style={styles.templateText}>Template 1: Basic Website</Text>
          <Text style={styles.templateFeatures}>No additional features enabled</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 30,
    paddingTop: 50,
    paddingBottom: 50,
    alignItems: 'center',
  },
  businessInfo: {
    alignItems: 'center',
  },
  businessName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  businessCategory: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  description: {
    fontSize: 16,
    color: '#4a5568',
    lineHeight: 24,
  },
  contactItem: {
    paddingVertical: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#4a5568',
  },
  templateInfo: {
    marginTop: 10,
    marginBottom: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  templateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#718096',
  },
  templateFeatures: {
    fontSize: 12,
    color: '#a0aec0',
    marginTop: 5,
  },
});

export default Template1;
