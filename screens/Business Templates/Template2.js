import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const Template2 = ({ business, colorScheme }) => {
  // Template 2: Only directions feature is enabled
  
  const handleCall = () => {
    if (business?.contactNumber) {
      Linking.openURL(`tel:${business.contactNumber}`);
    }
  };

  const handleMap = () => {
    if (business?.address) {
      const address = encodeURIComponent(business.address);
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${address}`);
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
          
          <View style={styles.featureBadges}>
            <View style={styles.badge}>
              <Ionicons name="navigate-outline" size={14} color="#fff" />
              <Text style={styles.badgeText}>Directions</Text>
            </View>
          </View>
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
        
        {/* Directions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="navigate-outline" size={24} color={colorScheme.primary} />
            <Text style={[styles.sectionTitle, { color: colorScheme.primary }]}>Location</Text>
          </View>
          
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>{business?.address || 'Address not available'}</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.directionsButton, { backgroundColor: colorScheme.primary }]}
            onPress={handleMap}
          >
            <Ionicons name="navigate" size={20} color="#fff" />
            <Text style={styles.directionsButtonText}>Get Directions</Text>
          </TouchableOpacity>

          <View style={styles.directionsInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={18} color={colorScheme.primary} />
              <Text style={styles.infoText}>
                {business?.openingHour && business?.closingHour 
                  ? `Open ${business.openingHour}:00 - ${business.closingHour}:00`
                  : 'Working hours not available'}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="information-circle-outline" size={18} color={colorScheme.primary} />
              <Text style={styles.infoText}>
                Tap "Get Directions" to open in maps app
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="call-outline" size={24} color={colorScheme.primary} />
            <Text style={[styles.sectionTitle, { color: colorScheme.primary }]}>Contact</Text>
          </View>
          
          <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
            <Ionicons name="call" size={20} color={colorScheme.primary} />
            <Text style={styles.contactText}>{business?.contactNumber || 'No phone number available'}</Text>
          </TouchableOpacity>
          
          <View style={styles.contactItem}>
            <Ionicons name="mail" size={20} color={colorScheme.primary} />
            <Text style={styles.contactText}>{business?.email || 'No email available'}</Text>
          </View>
        </View>
        
        <View style={styles.templateInfo}>
          <Text style={styles.templateText}>Template 2: Directions Website</Text>
          <Text style={styles.templateFeatures}>Only Directions feature is enabled</Text>
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
    marginBottom: 20,
  },
  featureBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 5,
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
  addressContainer: {
    marginBottom: 15,
  },
  addressText: {
    fontSize: 16,
    color: '#4a5568',
    lineHeight: 24,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  directionsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  directionsInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    padding: 15,
    borderRadius: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#4a5568',
    marginLeft: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactText: {
    fontSize: 16,
    color: '#4a5568',
    marginLeft: 10,
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

export default Template2;
